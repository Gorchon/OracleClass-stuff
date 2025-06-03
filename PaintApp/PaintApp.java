import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.geom.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import javax.imageio.ImageIO;
import javax.swing.*;

/**
 * M11 – Java Paint App | Session 3 complete
 * -------------------------------------------------------------
 * • Left-click colour swatch → stroke colour
 * • Right-click colour swatch → fill colour (panel shows choice)
 * • Draw / erase only with LEFT mouse button
 * • Eraser size adjustable with slider
 */
public class PaintApp {

    public static void main(String[] args) {
        SwingUtilities.invokeLater(PaintApp::new);
    }

    /** Drawing tools */
    enum Tool {
        PENCIL, RECTANGLE, OVAL, ARC, ERASER
    }

    /** Built-in palette */
    private static final Color[] PALETTE = {
            Color.BLACK, Color.DARK_GRAY, Color.GRAY, Color.LIGHT_GRAY,
            Color.RED, Color.GREEN, Color.YELLOW, Color.BLUE,
            Color.CYAN, Color.MAGENTA
    };

    /** Simple POJO that also stores fill colour */
    class ColoredShape {
        Shape shape;
        Color stroke;
        Color fill; // null → no fill

        ColoredShape(Shape s, Color stroke, Color fill) {
            this.shape = s;
            this.stroke = stroke;
            this.fill = fill;
        }
    }

    /** Main canvas */
    class DrawingPanel extends JPanel {

        private final List<ColoredShape> shapes = new ArrayList<>();
        private ColoredShape previewShape; // shape under construction
        private Point startPt; // drag origin
        private Tool tool = Tool.PENCIL;
        private Color strokeColour = Color.BLACK;
        private Color fillColour = null; // ← default: no fill
        private int eraserSizePX = 12; // default eraser diameter

        /* API called by the UI */
        void setTool(Tool t) {
            tool = t;
        }

        void setStroke(Color c) {
            strokeColour = c;
        }

        void setFill(Color c) {
            fillColour = c;
        }

        void setEraserSize(int px) {
            eraserSizePX = px;
        }

        /* Constructor – register mouse handlers */
        DrawingPanel() {
            setBackground(Color.WHITE);

            addMouseListener(new MouseAdapter() {
                @Override
                public void mousePressed(MouseEvent e) {
                    if (SwingUtilities.isLeftMouseButton(e)) {
                        startPt = e.getPoint();
                        previewShape = null;
                    }
                }

                @Override
                public void mouseReleased(MouseEvent e) {
                    if (previewShape != null) {
                        shapes.add(previewShape);
                        previewShape = null;
                        repaint();
                    }
                }
            });

            addMouseMotionListener(new MouseAdapter() {
                @Override
                public void mouseDragged(MouseEvent e) {
                    if (!SwingUtilities.isLeftMouseButton(e))
                        return;

                    Shape s = null;
                    switch (tool) {

                        case PENCIL -> {
                            shapes.add(new ColoredShape(
                                    new Line2D.Double(startPt, e.getPoint()),
                                    strokeColour, null));
                            startPt = e.getPoint(); // continue free-hand
                        }

                        case RECTANGLE -> s = new Rectangle2D.Double(
                                Math.min(startPt.x, e.getX()),
                                Math.min(startPt.y, e.getY()),
                                Math.abs(startPt.x - e.getX()),
                                Math.abs(startPt.y - e.getY()));

                        case OVAL -> s = new Ellipse2D.Double(
                                Math.min(startPt.x, e.getX()),
                                Math.min(startPt.y, e.getY()),
                                Math.abs(startPt.x - e.getX()),
                                Math.abs(startPt.y - e.getY()));

                        case ARC -> s = new Arc2D.Double(
                                Math.min(startPt.x, e.getX()),
                                Math.min(startPt.y, e.getY()),
                                Math.abs(startPt.x - e.getX()),
                                Math.abs(startPt.y - e.getY()),
                                0, 180, Arc2D.OPEN);

                        case ERASER -> {
                            int r = eraserSizePX;
                            shapes.add(new ColoredShape(
                                    new Ellipse2D.Double(e.getX() - r / 2.0, e.getY() - r / 2.0, r, r),
                                    getBackground(), getBackground()));
                        }
                    }

                    if (s != null)
                        previewShape = new ColoredShape(s, strokeColour, fillColour);

                    repaint();
                }
            });
        } // end-constructor

        /* Painting routine */
        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            Graphics2D g2 = (Graphics2D) g;

            // already finished shapes
            for (ColoredShape cs : shapes)
                drawShape(g2, cs);
            // live preview
            if (previewShape != null)
                drawShape(g2, previewShape);
        }

        private void drawShape(Graphics2D g2, ColoredShape cs) {
            if (cs.fill != null) {
                g2.setColor(cs.fill);
                g2.fill(cs.shape);
            }
            g2.setColor(cs.stroke);
            g2.draw(cs.shape);
        }

        /* Small helpers used by the buttons */
        void clearAll() {
            shapes.clear();
            previewShape = null;
            repaint();
        }

        void undo() {
            if (!shapes.isEmpty()) {
                shapes.removeLast();
                repaint();
            }
        }

        void savePNG() {
            BufferedImage img = new BufferedImage(getWidth(), getHeight(), BufferedImage.TYPE_INT_RGB);
            Graphics2D g2 = img.createGraphics();
            paint(g2);
            g2.dispose();
            try {
                File out = new File("drawing.png");
                ImageIO.write(img, "png", out);
                JOptionPane.showMessageDialog(this, "Saved to:\n" + out.getAbsolutePath());
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Save error: " + ex.getMessage());
            }
        }
    } // DrawingPanel ─────────────────────────────────────────────

    /* ========== UI constructor ========== */
    public PaintApp() {

        JFrame frame = new JFrame("M11 Java Paint App");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLayout(new BorderLayout());

        /* Canvas */
        DrawingPanel canvas = new DrawingPanel();
        frame.add(canvas, BorderLayout.CENTER);

        /* Top toolbar */
        JPanel bar = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 6));

        // ► stroke / fill preview squares
        JPanel strokeBox = colourBox(Color.BLACK, 25);
        JPanel fillBox = colourBox(new Color(255, 255, 255, 0), 25); // transparent = "no fill"

        bar.add(new JLabel("Stroke:"));
        bar.add(strokeBox);
        bar.add(new JLabel("Fill: (R-click)"));
        bar.add(fillBox);

        // ► tool buttons
        ButtonGroup toolGroup = new ButtonGroup();
        for (Tool t : Tool.values()) {
            JToggleButton b = new JToggleButton(t.name());
            b.addActionListener(e -> canvas.setTool(t));
            if (t == Tool.PENCIL)
                b.setSelected(true);
            bar.add(b);
            toolGroup.add(b);
        }

        // ► palette swatches (L-click = stroke, R-click = fill)
        for (Color c : PALETTE) {
            JPanel sw = colourBox(c, 25);
            sw.setToolTipText("L-click: stroke | R-click: fill");
            sw.addMouseListener(new MouseAdapter() {
                @Override
                public void mousePressed(MouseEvent e) {
                    if (SwingUtilities.isLeftMouseButton(e)) {
                        canvas.setStroke(c);
                        strokeBox.setBackground(c);
                    } else if (SwingUtilities.isRightMouseButton(e)) {
                        canvas.setFill(c);
                        fillBox.setBackground(c);
                    }
                }
            });
            bar.add(sw);
        }

        // ► eraser size slider (only affects ERASER)
        JSlider eraserSlider = new JSlider(4, 60, 12);
        eraserSlider.setPreferredSize(new Dimension(120, 20));
        eraserSlider.setToolTipText("Eraser size");
        eraserSlider.addChangeListener(e -> canvas.setEraserSize(eraserSlider.getValue()));
        bar.add(new JLabel("Eraser size:"));
        bar.add(eraserSlider);

        // ► utility buttons
        JButton undo = new JButton("Undo"), clear = new JButton("Clear"), save = new JButton("Save PNG");
        undo.addActionListener(e -> canvas.undo());
        clear.addActionListener(e -> canvas.clearAll());
        save.addActionListener(e -> canvas.savePNG());
        bar.add(undo);
        bar.add(clear);
        bar.add(save);

        frame.add(bar, BorderLayout.NORTH);
        frame.setSize(1100, 750);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }

    /* Helper: makes a square panel with its colour */
    private static JPanel colourBox(Color c, int size) {
        JPanel p = new JPanel();
        p.setBackground(c);
        p.setPreferredSize(new Dimension(size, size));
        p.setBorder(BorderFactory.createLineBorder(Color.BLACK));
        return p;
    }
}
