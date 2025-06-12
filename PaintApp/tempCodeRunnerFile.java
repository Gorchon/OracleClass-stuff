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
 * M11 – Java Paint App | Session 3 complete (con iconos)
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

    /** Simple POJO que también guarda color de relleno */
    class ColoredShape {
        Shape shape;
        Color stroke;
        Color fill; // null → sin relleno

        ColoredShape(Shape s, Color stroke, Color fill) {
            this.shape = s;
            this.stroke = stroke;
            this.fill = fill;
        }
    }

    /** Lienzo principal */
    class DrawingPanel extends JPanel {
        private final List<ColoredShape> shapes = new ArrayList<>();
        private ColoredShape previewShape; // forma en construcción
        private Point startPt; // origen del drag
        private Tool tool = Tool.PENCIL;
        private Color strokeColour = Color.BLACK;
        private Color fillColour = null; // sin relleno por defecto
        private int eraserSizePX = 12; // diámetro del borrador

        /* API pública */
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

        DrawingPanel() {
            setBackground(Color.WHITE);

            addMouseListener(new MouseAdapter() {
                @Override
                public void mousePressed(MouseEvent e) {
                    if (!SwingUtilities.isLeftMouseButton(e))
                        return;
                    startPt = e.getPoint();
                    previewShape = null;
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
                            startPt = e.getPoint();
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
                    if (s != null) {
                        previewShape = new ColoredShape(s, strokeColour, fillColour);
                    }
                    repaint();
                }
            });
        }

        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            Graphics2D g2 = (Graphics2D) g;
            for (ColoredShape cs : shapes) {
                if (cs.fill != null) {
                    g2.setColor(cs.fill);
                    g2.fill(cs.shape);
                }
                g2.setColor(cs.stroke);
                g2.draw(cs.shape);
            }
            if (previewShape != null) {
                if (previewShape.fill != null) {
                    g2.setColor(previewShape.fill);
                    g2.fill(previewShape.shape);
                }
                g2.setColor(previewShape.stroke);
                g2.draw(previewShape.shape);
            }
        }

        void clearAll() {
            shapes.clear();
            previewShape = null;
            repaint();
        }

        void undo() {
            if (!shapes.isEmpty()) {
                shapes.remove(shapes.size() - 1);
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
                JOptionPane.showMessageDialog(this, "Guardado en:\n" + out.getAbsolutePath());
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Error al guardar: " + ex.getMessage());
            }
        }
    }

    public PaintApp() {
        JFrame frame = new JFrame("M11 Java Paint App (con iconos)");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLayout(new BorderLayout());

        DrawingPanel canvas = new DrawingPanel();
        frame.add(canvas, BorderLayout.CENTER);

        JPanel bar = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 6));

        // Indicadores de color
        JPanel strokeBox = colourBox(Color.BLACK, 25);
        JPanel fillBox = colourBox(new Color(255, 255, 255, 0), 25);
        bar.add(new JLabel("Stroke:"));
        bar.add(strokeBox);
        bar.add(new JLabel("Fill (R-click):"));
        bar.add(fillBox);

        // Botones de herramienta con iconos
        ButtonGroup toolGroup = new ButtonGroup();
        for (Tool t : Tool.values()) {
            String iconFile = "icons/" + t.name().toLowerCase() + ".png";
            JToggleButton btn;
            if (new File(iconFile).exists()) {
                btn = new JToggleButton(new ImageIcon(iconFile));
            } else {
                btn = new JToggleButton(t.name());
            }
            btn.setToolTipText(t.name());
            btn.addActionListener(e -> canvas.setTool(t));
            if (t == Tool.PENCIL)
                btn.setSelected(true);
            bar.add(btn);
            toolGroup.add(btn);
        }

        // Paleta de colores
        for (Color c : PALETTE) {
            JPanel swatch = colourBox(c, 25);
            swatch.setToolTipText("L-click = stroke | R-click = fill");
            swatch.addMouseListener(new MouseAdapter() {
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
            bar.add(swatch);
        }

        // Slider de borrador
        JSlider eraserSlider = new JSlider(4, 60, 12);
        eraserSlider.setPreferredSize(new Dimension(120, 20));
        eraserSlider.setToolTipText("Eraser size");
        eraserSlider.addChangeListener(e -> canvas.setEraserSize(eraserSlider.getValue()));
        bar.add(new JLabel("Eraser size:"));
        bar.add(eraserSlider);

        // Botones utilitarios
        JButton undoBtn = new JButton("Undo");
        JButton clearBtn = new JButton(new ImageIcon("icons/clear.png"));
        clearBtn.setToolTipText("Clear");
        JButton saveBtn = new JButton("Save PNG");

        undoBtn.addActionListener(e -> canvas.undo());
        clearBtn.addActionListener(e -> canvas.clearAll());
        saveBtn.addActionListener(e -> canvas.savePNG());

        bar.add(undoBtn);
        bar.add(clearBtn);
        bar.add(saveBtn);

        frame.add(bar, BorderLayout.NORTH);
        frame.setSize(1100, 750);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }

    private static JPanel colourBox(Color c, int size) {
        JPanel p = new JPanel();
        p.setBackground(c);
        p.setPreferredSize(new Dimension(size, size));
        p.setBorder(BorderFactory.createLineBorder(Color.BLACK));
        return p;
    }
}
