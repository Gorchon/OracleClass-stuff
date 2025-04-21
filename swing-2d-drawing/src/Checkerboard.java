import java.awt.*;
import javax.swing.*;

public class Checkerboard extends JPanel {

    private static final int ROWS = 8;
    private static final int COLS = 8;
    private static final int TILE_SIZE = 50;

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2d = (Graphics2D) g;

        for (int row = 0; row < ROWS; ++row) {
            for (int col = 0; col < COLS; ++col) {
                if ((row + col) % 2 == 0) {
                    g2d.setColor(Color.BLACK);
                } else {
                    g2d.setColor(Color.WHITE);
                }
                g2d.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }

    public static void main(String[] args) {
        JFrame frame = new JFrame("Checkerboard");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.add(new Checkerboard());
        frame.setSize(400, 430);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }
}
