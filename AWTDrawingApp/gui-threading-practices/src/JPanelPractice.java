import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;
import java.awt.Color;

public class JPanelPractice extends JFrame {

    public JPanelPractice() {
        setTitle("JPanel Practice");
        setSize(900, 600);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(null);

        // First JPanel (white background)
        JPanel whitePanel = new JPanel();
        whitePanel.setBounds(0, 0, 900, 500);
        whitePanel.setBackground(Color.WHITE);
        add(whitePanel);

        // Second JPanel (gray background)
        JPanel grayPanel = new JPanel();
        grayPanel.setBounds(0, 500, 900, 100);
        grayPanel.setBackground(Color.LIGHT_GRAY);
        grayPanel.setLayout(null);
        add(grayPanel);

        // Black panel inside the gray panel
        JPanel blackPanel = new JPanel();
        blackPanel.setBounds(0, 0, 50, 50);
        blackPanel.setBackground(Color.BLACK);
        grayPanel.add(blackPanel);

        // Red panel inside the gray panel
        JPanel redPanel = new JPanel();
        redPanel.setBounds(850, 0, 50, 50);
        redPanel.setBackground(Color.RED);
        grayPanel.add(redPanel);
    }

    // Main method
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            JPanelPractice jPanelPractice = new JPanelPractice();
            jPanelPractice.setVisible(true);
        });
    }
}
