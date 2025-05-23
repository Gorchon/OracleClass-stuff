import java.util.ArrayList;
import java.util.List;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.geom.*;

import javax.swing.*;

public class PaintApp {
    public static void main(String[] args) {
        new PaintApp();
    }

    // Tool options
    enum Tool {
        PENCIL, RECTANGLE, OVAL, ARC, ERASER
    }

    // Color palette (10 total colors)
    private static final Color[] COLOR_PALETTE = {
            Color.BLACK, Color.DARK_GRAY, Color.GRAY, Color.LIGHT_GRAY,
            Color.RED, Color.GREEN, Color.YELLOW, Color.BLUE,
            Color.CYAN, Color.MAGENTA
    };

    // Class representing a colored shape
    class ColoredShape {
        Shape shape;
        Color color;

        public ColoredShape(Shape shape, Color color) {
            this.shape = shape;
            this.color = color;
        }
    }

    // Custom drawing panel
    class DrawingPanel extends JPanel {
        private List<ColoredShape> shapes = new ArrayList<>();
        private ColoredShape currentShape;
        private Point startPoint;
        private Tool currentTool = Tool.PENCIL;
        private Color currentColor = Color.BLACK;

        public void setCurrentTool(Tool tool) {
            this.currentTool = tool;
        }

        public void setCurrentColor(Color color) {
            this.currentColor = color;
        }

        public DrawingPanel() {
            setBackground(Color.WHITE);

            addMouseListener(new MouseAdapter() {
                @Override
                public void mousePressed(MouseEvent e) {
                    startPoint = e.getPoint();
                    currentShape = null;
                }

                @Override
                public void mouseReleased(MouseEvent e) {
                    if (currentShape != null) {
                        shapes.add(currentShape);
                        currentShape = null;
                        repaint();
                    }
                }
            });

            addMouseMotionListener(new MouseAdapter() {
                @Override
                public void mouseDragged(MouseEvent e) {
                    switch (currentTool) {
                        case PENCIL:
                            shapes.add(new ColoredShape(
                                    new Line2D.Double(startPoint, e.getPoint()),
                                    currentColor));
                            startPoint = e.getPoint();
                            break;
                        case RECTANGLE:
                            currentShape = new ColoredShape(
                                    new Rectangle2D.Double(
                                            Math.min(startPoint.x, e.getX()),
                                            Math.min(startPoint.y, e.getY()),
                                            Math.abs(startPoint.x - e.getX()),
                                            Math.abs(startPoint.y - e.getY())),
                                    currentColor);
                            break;
                        case OVAL:
                            currentShape = new ColoredShape(
                                    new Ellipse2D.Double(
                                            Math.min(startPoint.x, e.getX()),
                                            Math.min(startPoint.y, e.getY()),
                                            Math.abs(startPoint.x - e.getX()),
                                            Math.abs(startPoint.y - e.getY())),
                                    currentColor);
                            break;
                        case ARC:
                            currentShape = new ColoredShape(
                                    new Arc2D.Double(
                                            Math.min(startPoint.x, e.getX()),
                                            Math.min(startPoint.y, e.getY()),
                                            Math.abs(startPoint.x - e.getX()),
                                            Math.abs(startPoint.y - e.getY()),
                                            0, 180, Arc2D.OPEN),
                                    currentColor);
                            break;
                        case ERASER:
                            shapes.add(new ColoredShape(
                                    new Line2D.Double(startPoint, e.getPoint()),
                                    Color.WHITE));
                            startPoint = e.getPoint();
                            break;
                    }
                    repaint();
                }

                @Override
                public void mouseMoved(MouseEvent e) {
                    currentShape = null;
                }
            });
        }

        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            Graphics2D g2d = (Graphics2D) g;

            for (ColoredShape cs : shapes) {
                g2d.setColor(cs.color);
                g2d.draw(cs.shape);
            }

            if (currentShape != null) {
                g2d.setColor(currentShape.color);
                g2d.draw(currentShape.shape);
            }
        }
    }

    public PaintApp() {
        JFrame frame = new JFrame("Java Paint App");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLayout(new BorderLayout());

        DrawingPanel drawingPanel = new DrawingPanel();
        frame.add(drawingPanel, BorderLayout.CENTER);

        JPanel toolPanel = new JPanel();
        ButtonGroup toolGroup = new ButtonGroup();

        // Tool buttons
        JToggleButton pencilBtn = new JToggleButton("Pencil");
        pencilBtn.addActionListener(e -> drawingPanel.setCurrentTool(Tool.PENCIL));
        toolGroup.add(pencilBtn);
        toolPanel.add(pencilBtn);

        JToggleButton rectBtn = new JToggleButton("Rectangle");
        rectBtn.addActionListener(e -> drawingPanel.setCurrentTool(Tool.RECTANGLE));
        toolGroup.add(rectBtn);
        toolPanel.add(rectBtn);

        JToggleButton ovalBtn = new JToggleButton("Oval");
        ovalBtn.addActionListener(e -> drawingPanel.setCurrentTool(Tool.OVAL));
        toolGroup.add(ovalBtn);
        toolPanel.add(ovalBtn);

        JToggleButton arcBtn = new JToggleButton("Arc");
        arcBtn.addActionListener(e -> drawingPanel.setCurrentTool(Tool.ARC));
        toolGroup.add(arcBtn);
        toolPanel.add(arcBtn);

        JToggleButton eraserBtn = new JToggleButton("Eraser");
        eraserBtn.addActionListener(e -> drawingPanel.setCurrentTool(Tool.ERASER));
        toolGroup.add(eraserBtn);
        toolPanel.add(eraserBtn);

        // Color palette
        for (Color color : COLOR_PALETTE) {
            JPanel colorBox = new JPanel();
            colorBox.setBackground(color);
            colorBox.setPreferredSize(new Dimension(25, 25));
            colorBox.setBorder(BorderFactory.createLineBorder(Color.BLACK));
            colorBox.addMouseListener(new MouseAdapter() {
                @Override
                public void mousePressed(MouseEvent e) {
                    drawingPanel.setCurrentColor(color);
                }
            });
            toolPanel.add(colorBox);
        }

        frame.add(toolPanel, BorderLayout.NORTH);
        frame.setSize(900, 600);
        frame.setVisible(true);
    }
}
