package com.ponggame;

import com.badlogic.gdx.ApplicationAdapter;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Input;
import com.badlogic.gdx.audio.Music;
import com.badlogic.gdx.audio.Sound;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.TimeUtils;

public class PongGame extends ApplicationAdapter {
    private SpriteBatch batch;

    // 1. Paddle attributes
    private static final float PADDLE_WIDTH = 15;
    private static final float PADDLE_HEIGHT = 100;
    private static final float PADDLE_SPEED = 500;
    private static final float PADDLE_OFFSET = 20;

    // 2. Ball attributes
    private static final float BALL_SIZE = 15;
    private static final float INITIAL_BALL_SPEED = 300;
    private static final float BALL_SPEED_INCREASE = 1.05f;
    private static final float MAX_BALL_SPEED = 600;

    // 3. Court Net (center line) attributes
    private static final float CENTER_LINE_WIDTH = 4;
    private static final float CENTER_LINE_SEGMENT_HEIGHT = 20;
    private static final float CENTER_LINE_GAP = 10;

    // 4. Winning score
    private static final int WINNING_SCORE = 5;

    // 5. Player positions
    private float player1Y;
    private float player2Y;

    // 6. Player scores
    private int player1Score;
    private int player2Score;

    // 7. Ball position and speed
    private float ballX;
    private float ballY;
    private float ballSpeedX;
    private float ballSpeedY;

    // 8. Last score time
    private long lastScoreTime;

    // 9. Game state
    private enum GameState {
        PLAYING,
        SERVING,
        GAME_OVER
    }

    private GameState gameState;
    private boolean serveToPlayer1;
    private boolean isPaused;

    // 10. Rendering
    private ShapeRenderer shapeRenderer;
    private BitmapFont font;

    // 11. Audio
    private Sound paddleHitSound;
    private Sound wallBounceSound;
    private Sound scoreSound;
    private Sound roundEndSound;
    private Sound gameStartSound;
    private Sound pauseSound;
    private Sound resumeSound;
    private Music backgroundMusic;

    @Override
    public void create() {
        // shape renderer and font
        shapeRenderer = new ShapeRenderer();
        font = new BitmapFont();
        font.getData().setScale(2); // Make font larger

        // sprite batch
        batch = new SpriteBatch();

        // Load sound effects
        paddleHitSound = Gdx.audio.newSound(Gdx.files.internal("paddle_hit.ogg"));
        wallBounceSound = Gdx.audio.newSound(Gdx.files.internal("wall_bounce.ogg"));
        scoreSound = Gdx.audio.newSound(Gdx.files.internal("score.ogg"));
        roundEndSound = Gdx.audio.newSound(Gdx.files.internal("round_end.ogg"));
        gameStartSound = Gdx.audio.newSound(Gdx.files.internal("game_start.ogg"));
        pauseSound = Gdx.audio.newSound(Gdx.files.internal("pause.ogg"));
        resumeSound = Gdx.audio.newSound(Gdx.files.internal("resume.ogg"));

        // Load and configure background music
        backgroundMusic = Gdx.audio.newMusic(Gdx.files.internal("background_music.ogg"));
        backgroundMusic.setLooping(true);
        backgroundMusic.setVolume(0.8f); // Lower volume for background music

        // Initialize game state
        resetGame();

        // Play game start sound and background music
        gameStartSound.play();
        backgroundMusic.play();
    }

    @Override
    public void render() {
        // Clear screen to black
        Gdx.gl.glClearColor(0, 0, 0, 1);
        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);

        // Handle input every frame
        handleInput(Gdx.graphics.getDeltaTime());

        // Update game logic only if not paused
        if (!isPaused) {
            update(Gdx.graphics.getDeltaTime());
        }

        // Draw everything
        draw();
    }

    @Override
    public void dispose() {
        shapeRenderer.dispose();
        font.dispose();
        batch.dispose();

        // Dispose sound effects
        paddleHitSound.dispose();
        wallBounceSound.dispose();
        scoreSound.dispose();
        roundEndSound.dispose();
        gameStartSound.dispose();
        pauseSound.dispose();
        resumeSound.dispose();

        // Dispose background music
        backgroundMusic.dispose();
    }

    // --- Custom methods ---

    private void resetBall() {
        ballX = Gdx.graphics.getWidth() / 2f - BALL_SIZE / 2f;
        ballY = Gdx.graphics.getHeight() / 2f - BALL_SIZE / 2f;
        ballSpeedX = 0;
        ballSpeedY = 0;
        lastScoreTime = TimeUtils.millis();
        gameState = GameState.SERVING;
    }

    private void resetGame() {
        player1Y = Gdx.graphics.getHeight() / 2f - PADDLE_HEIGHT / 2f;
        player2Y = Gdx.graphics.getHeight() / 2f - PADDLE_HEIGHT / 2f;

        player1Score = 0;
        player2Score = 0;

        serveToPlayer1 = MathUtils.randomBoolean();
        resetBall();
        isPaused = false;
    }

    private void handleInput(float delta) {
        // Toggle pause
        if (Gdx.input.isKeyJustPressed(Input.Keys.ESCAPE)) {
            isPaused = !isPaused;
            if (isPaused)
                pauseSound.play();
            else
                resumeSound.play();
        }
        if (isPaused && !Gdx.input.isKeyJustPressed(Input.Keys.ESCAPE)) {
            return;
        }

        // Restart if game over
        if (gameState == GameState.GAME_OVER && Gdx.input.isKeyJustPressed(Input.Keys.R)) {
            resetGame();
            gameStartSound.play();
            return;
        }

        // Player 1 (W/S)
        if (Gdx.input.isKeyPressed(Input.Keys.W))
            player1Y += PADDLE_SPEED * delta;
        if (Gdx.input.isKeyPressed(Input.Keys.S))
            player1Y -= PADDLE_SPEED * delta;

        // Player 2 (UP/DOWN)
        if (Gdx.input.isKeyPressed(Input.Keys.UP))
            player2Y += PADDLE_SPEED * delta;
        if (Gdx.input.isKeyPressed(Input.Keys.DOWN))
            player2Y -= PADDLE_SPEED * delta;

        // Clamp paddles
        player1Y = MathUtils.clamp(player1Y, 0, Gdx.graphics.getHeight() - PADDLE_HEIGHT);
        player2Y = MathUtils.clamp(player2Y, 0, Gdx.graphics.getHeight() - PADDLE_HEIGHT);

        // Serve on SPACE
        if (gameState == GameState.SERVING && Gdx.input.isKeyJustPressed(Input.Keys.SPACE)) {
            serveBall();
        }
    }

    private void serveBall() {
        gameState = GameState.PLAYING;
        float angle;
        switch (MathUtils.random(0, 2)) {
            case 0:
                angle = MathUtils.random(0f, 45f);
                break;
            case 1:
                angle = MathUtils.random(135f, 225f);
                break;
            default:
                angle = MathUtils.random(315f, 360f);
                break;
        }
        if (serveToPlayer1)
            angle = (angle + 180f) % 360f;

        ballSpeedX = INITIAL_BALL_SPEED * MathUtils.cosDeg(angle);
        ballSpeedY = INITIAL_BALL_SPEED * MathUtils.sinDeg(angle);
        paddleHitSound.play();
    }

    private void update(float delta) {
        if (gameState != GameState.PLAYING)
            return;

        // Move ball
        ballX += ballSpeedX * delta;
        ballY += ballSpeedY * delta;

        // Bounce off top/bottom
        if (ballY < 0 || ballY > Gdx.graphics.getHeight() - BALL_SIZE) {
            ballSpeedY *= -1;
            ballY = MathUtils.clamp(ballY, 0, Gdx.graphics.getHeight() - BALL_SIZE);
            wallBounceSound.play(0.5f);
        }

        // Left paddle collision
        if (ballX < PADDLE_OFFSET + PADDLE_WIDTH
                && ballY + BALL_SIZE > player1Y
                && ballY < player1Y + PADDLE_HEIGHT) {

            float hitPos = (ballY - player1Y) / PADDLE_HEIGHT;
            float angle = MathUtils.map(0f, 1f, -45f, 45f, hitPos);
            float speed = Math.min(
                    (float) Math.hypot(ballSpeedX, ballSpeedY) * BALL_SPEED_INCREASE,
                    MAX_BALL_SPEED);
            ballSpeedX = speed * MathUtils.cosDeg(angle);
            ballSpeedY = speed * MathUtils.sinDeg(angle);
            ballX = PADDLE_OFFSET + PADDLE_WIDTH; // prevent sticking
            paddleHitSound.play();
        }

        // Right paddle collision
        if (ballX > Gdx.graphics.getWidth() - PADDLE_OFFSET - PADDLE_WIDTH - BALL_SIZE
                && ballY + BALL_SIZE > player2Y
                && ballY < player2Y + PADDLE_HEIGHT) {

            float hitPos = (ballY - player2Y) / PADDLE_HEIGHT;
            float angle = MathUtils.map(0f, 1f, 225f, 135f, hitPos);
            float speed = Math.min(
                    (float) Math.hypot(ballSpeedX, ballSpeedY) * BALL_SPEED_INCREASE,
                    MAX_BALL_SPEED);
            ballSpeedX = speed * MathUtils.cosDeg(angle);
            ballSpeedY = speed * MathUtils.sinDeg(angle);
            ballX = Gdx.graphics.getWidth() - PADDLE_OFFSET - PADDLE_WIDTH - BALL_SIZE;
            paddleHitSound.play();
        }

        // Score
        if (ballX < 0) {
            player2Score++;
            serveToPlayer1 = true;
            scoreSound.play();
            resetBall();
        }
        if (ballX > Gdx.graphics.getWidth()) {
            player1Score++;
            serveToPlayer1 = false;
            scoreSound.play();
            resetBall();
        }

        // Check for winner
        if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
            gameState = GameState.GAME_OVER;
            roundEndSound.play();
        }
    }

    private void draw() {
        // Draw paddles, ball and net
        shapeRenderer.begin(ShapeRenderer.ShapeType.Filled);
        shapeRenderer.setColor(Color.WHITE);
        shapeRenderer.rect(PADDLE_OFFSET, player1Y, PADDLE_WIDTH, PADDLE_HEIGHT);
        shapeRenderer.rect(
                Gdx.graphics.getWidth() - PADDLE_OFFSET - PADDLE_WIDTH,
                player2Y, PADDLE_WIDTH, PADDLE_HEIGHT);

        // Blinking ball when serving
        if (gameState != GameState.SERVING ||
                (TimeUtils.timeSinceMillis(lastScoreTime) / 200) % 2 == 0) {
            shapeRenderer.rect(ballX, ballY, BALL_SIZE, BALL_SIZE);
        }

        // Center net
        shapeRenderer.setColor(Color.GRAY);
        for (int y = 0; y < Gdx.graphics.getHeight(); y += CENTER_LINE_SEGMENT_HEIGHT + CENTER_LINE_GAP) {
            shapeRenderer.rect(
                    Gdx.graphics.getWidth() / 2f - CENTER_LINE_WIDTH / 2f,
                    y,
                    CENTER_LINE_WIDTH,
                    CENTER_LINE_SEGMENT_HEIGHT);
        }
        shapeRenderer.end();

        // Draw scores and messages
        batch.begin();
        font.setColor(Color.WHITE);
        font.draw(batch, String.valueOf(player1Score),
                Gdx.graphics.getWidth() / 2f - 50, Gdx.graphics.getHeight() - 20);
        font.draw(batch, String.valueOf(player2Score),
                Gdx.graphics.getWidth() / 2f + 30, Gdx.graphics.getHeight() - 20);

        if (isPaused) {
            font.draw(batch, "PAUSED",
                    Gdx.graphics.getWidth() / 2f - 50, Gdx.graphics.getHeight() / 2f + 50);
            font.draw(batch, "Press ESC to resume",
                    Gdx.graphics.getWidth() / 2f - 100, Gdx.graphics.getHeight() / 2f - 50);
        } else if (gameState == GameState.SERVING) {
            font.draw(batch, "PRESS SPACE to serve",
                    Gdx.graphics.getWidth() / 2f - 100, 50);
        } else if (gameState == GameState.GAME_OVER) {
            String winner = player1Score > player2Score
                    ? "Player 1 Wins!"
                    : "Player 2 Wins!";
            font.draw(batch, winner,
                    Gdx.graphics.getWidth() / 2f - 100, Gdx.graphics.getHeight() / 2f + 50);
            font.draw(batch, "Press R to restart",
                    Gdx.graphics.getWidth() / 2f - 100, Gdx.graphics.getHeight() / 2f - 50);
        }
        batch.end();
    }
}
