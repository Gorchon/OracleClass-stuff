import java.awt.*;
import javax.swing.*;

public class ConcentricCircles extends JPanel {

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2d = (Graphics2D) g;

 
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

      
        int centerX = getWidth() / 2;
        int centerY = getHeight() / 2;

        
        for (int i = 10; i > 0; i--) {
            int diameter = i * 30;
            int x = centerX - diameter / 2;
            int y = centerY - diameter / 2;

            
            if (i % 2 == 0) {
                g2d.setColor(new Color(0, 100, 200)); 
            } else {
                g2d.setColor(new Color(200, 100, 0)); 
            }

            g2d.fillOval(x, y, diameter, diameter);
        }
    }

    public static void main(String[] args) {
        JFrame frame = new JFrame("Concentric Circles");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.add(new ConcentricCircles());
        frame.setSize(400, 430);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }
}
