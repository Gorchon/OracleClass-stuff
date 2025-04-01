import java.awt.Frame;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.MouseMotionAdapter;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.awt.Graphics;
import java.awt.Color;

public class AWTDrawingApp extends Frame {

    // Store drawing points
    private int lastX, lastY;

    public AWTDrawingApp() {
        setTitle("AWT Drawing App");
        setSize(600, 400);

        // Mouse listener for drawing
        addMouseListener(new MouseAdapter() {
            public void mousePressed(MouseEvent e) {
                lastX = e.getX();
                lastY = e.getY();
                Graphics g = getGraphics();
                g.setColor(Color.BLUE);
                g.drawLine(lastX, lastY, e.getX(), e.getY());
            }
        });

        // Mouse motion listener for dragging
        addMouseMotionListener(new MouseMotionAdapter() {
            public void mouseDragged(MouseEvent e) {
                Graphics g = getGraphics();
                g.setColor(Color.BLUE);
                g.drawLine(lastX, lastY, e.getX(), e.getY());
                lastX = e.getX();
                lastY = e.getY();
            }
        });

        // Window listener to close the app
        addWindowListener(new WindowAdapter() {
            public void windowClosing(WindowEvent e) {
                dispose();
            }
        });
    }

    // Main method
    public static void main(String[] args) {
        AWTDrawingApp app = new AWTDrawingApp();
        app.setVisible(true);
    }
}
