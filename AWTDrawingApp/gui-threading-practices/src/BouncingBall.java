import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.Random;

public class BouncingBall extends JFrame {

    // Constants
    private static final int WIDTH = 600;
    private static final int HEIGHT = 400;
    private static final int PADDLE_WIDTH = 100;
    private static final int PADDLE_HEIGHT = 15;
    private static final int BALL_SIZE = 20;

    // Game state
    private int ballX, ballY;
    private int ballSpeedX = 3, ballSpeedY = 3;
    private int paddleX;
    private int score = 0;
    private boolean gameRunning = true;

    // Constructor
    public BouncingBall() {
        setTitle("Bouncing Ball Game");
        setSize(WIDTH, HEIGHT);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setResizable(false);

        // Initialize positions
        paddleX = WIDTH / 2 - PADDLE_WIDTH / 2;
        resetBall();

        // Mouse motion listener for paddle control
        addMouseMotionListener(new MouseMotionAdapter() {
            public void mouseMoved(MouseEvent e) {
                paddleX = e.getX() - PADDLE_WIDTH / 2;
                if (paddleX < 0)
                    paddleX = 0;
                if (paddleX > WIDTH - PADDLE_WIDTH)
                    paddleX = WIDTH - PADDLE_WIDTH;
                repaint();
            }
        });

        // Game thread
        Thread gameThread = new Thread(() -> {
            while (gameRunning) {
                try {
                    Thread.sleep(10);
                    updateGame();
                    repaint();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

        gameThread.start();
    }

    // Game logic
    private void updateGame() {
        // Move ball
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Wall collisions
        if (ballX <= 0 || ballX >= WIDTH - BALL_SIZE) {
            ballSpeedX = -ballSpeedX;
        }
        if (ballY <= 0) {
            ballSpeedY = -ballSpeedY;
        }

        // Paddle collision
        if (ballY >= HEIGHT - PADDLE_HEIGHT - BALL_SIZE &&
                ballX + BALL_SIZE >= paddleX && ballX <= paddleX + PADDLE_WIDTH) {
            ballSpeedY = -ballSpeedY;
            score++;
        }

        // Game over
        if (ballY >= HEIGHT) {
            gameRunning = false;
            JOptionPane.showMessageDialog(this, "Game Over! Score: " + score, "Game Over",
                    JOptionPane.INFORMATION_MESSAGE);
            resetGame();
        }
    }

    private void resetBall() {
        Random rand = new Random();
        ballX = rand.nextInt(WIDTH - BALL_SIZE);
        ballY = 0;
        ballSpeedX = rand.nextBoolean() ? 3 : -3;
        ballSpeedY = 3;
    }

    private void resetGame() {
        score = 0;
        gameRunning = true;
        resetBall();
    }

    // Painting
    public void paint(Graphics g) {
        // Clear screen
        g.setColor(Color.WHITE);
        g.fillRect(0, 0, WIDTH, HEIGHT);

        // Draw paddle
        g.setColor(Color.BLUE);
        g.fillRect(paddleX, HEIGHT - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);

        // Draw ball
        g.setColor(Color.RED);
        g.fillOval(ballX, ballY, BALL_SIZE, BALL_SIZE);

        // Draw score
        g.setColor(Color.BLACK);
        g.setFont(new Font("Arial", Font.BOLD, 16));
        g.drawString("Score: " + score, 10, 20);
    }

    // Main method
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            BouncingBall game = new BouncingBall();
            game.setVisible(true);
        });
    }
}
