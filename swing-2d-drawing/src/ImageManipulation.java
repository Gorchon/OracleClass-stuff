import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import javax.imageio.ImageIO;
import javax.swing.*;

public class ImageManipulation extends JPanel {

    private BufferedImage originalImage;
    private BufferedImage grayscaleImage;

    public ImageManipulation() {
        try {
            originalImage = ImageIO.read(new File("test.jpg")); 
            grayscaleImage = convertToGrayscale(originalImage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private BufferedImage convertToGrayscale(BufferedImage original) {
        BufferedImage grayscale = new BufferedImage(
                original.getWidth(), original.getHeight(), BufferedImage.TYPE_INT_RGB);

        for (int y = 0; y < original.getHeight(); y++) {
            for (int x = 0; x < original.getWidth(); x++) {
                Color color = new Color(original.getRGB(x, y));
                int gray = (int) (color.getRed() * 0.299 +
                                  color.getGreen() * 0.587 +
                                  color.getBlue() * 0.114);
                Color grayColor = new Color(gray, gray, gray);
                grayscale.setRGB(x, y, grayColor.getRGB());
            }
        }

        return grayscale;
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);

        if (originalImage != null && grayscaleImage != null) {
            g.drawImage(originalImage, 20, 20, this);
            g.drawImage(grayscaleImage, originalImage.getWidth() + 40, 20, this);
        }
    }

    public static void main(String[] args) {
        JFrame frame = new JFrame("Image Manipulation");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.add(new ImageManipulation());
        frame.setSize(800, 400);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }
}
