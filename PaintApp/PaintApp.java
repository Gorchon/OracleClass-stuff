import java.util.ArrayList;
import java.util.List;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.Shape;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.geom.Line2D;

import javax.swing.ButtonGroup;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JToggleButton;

public class PaintApp {
    public static void main(String[] args) throws Exception {
        new PaintApp();
    }

    enum Tool{
        PENCIL
    }

    private static final Color[] COLOR_PALLETE = {
        Color.black,
        Color.darkGray,
        Color.gray
    };

    class ColoredShape{
        Shape shape;
        Color color;

        public ColoredShape(Shape shape, Color color){
            this.shape = shape;
            this.color = color;
        }
    }

    class DrawingPanel extends JPanel {
        private List<ColoredShape> shapes = new ArrayList<>();
        private ColoredShape currentShape;
        private Point starPoint;
        private Tool currentTool =  Tool.PENCIL;
        private Color currentColor = Color.black;

        public void setCurrentTool(Tool tool){
            this.currentTool = tool;
        }

        public void setCurrentColor(Color color){
            this.currentColor = color;
        }

        public Color getCurrentColor(){
            return this.currentColor;
        }

        public DrawingPanel(){
            setBackground(Color.white);

            addMouseListener(new MouseAdapter() {
                @Override
                public void mousePressed(MouseEvent e){
                    starPoint = e.getPoint();
                    currentShape = null;
                }

                @Override
                public void mouseReleased(MouseEvent e){
                    if(currentShape != null){
                        shapes.add(currentShape);
                        currentShape = null;
                        repaint();
                    }
                }
            });

            addMouseMotionListener(new MouseAdapter() {
                @Override
                public void mouseDragged(MouseEvent e){
                    switch (currentTool){
                        case PENCIL:
                            shapes.add(
                                new ColoredShape(
                                    new Line2D.Double(
                                        starPoint,
                                        e.getPoint()
                                    ),
                                    currentColor
                                )
                            );
                            starPoint = e.getPoint();
                            break;
                    }
                    repaint();
                }
            });
        }

        @Override
        protected void paintComponent(Graphics g){
            super.paintComponent(g);
            Graphics2D g2d = (Graphics2D)g;

            for(ColoredShape coloredShape : shapes){
                g2d.setColor(coloredShape.color);
                g2d.draw(coloredShape.shape);
            }

            if(currentShape != null){
                g2d.setColor(currentShape.color);
                g2d.draw(currentShape.shape);
            }
        }
    }

    public PaintApp(){
        JFrame frame = new JFrame("Java Paint App");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLayout(new BorderLayout()); 

        DrawingPanel drawingPanel = new DrawingPanel();
        frame.add(drawingPanel, BorderLayout.CENTER);

        JPanel toolPanel = new JPanel();
        ButtonGroup toolGroup = new ButtonGroup();

        JToggleButton pencilBtn = new JToggleButton("Pencil");
        pencilBtn.addActionListener(e -> drawingPanel.setCurrentTool(Tool.PENCIL));
        toolGroup.add(pencilBtn);
        toolPanel.add(pencilBtn);

        for(Color color : COLOR_PALLETE){
            JPanel colorPanel = new JPanel();
            colorPanel.setBackground(color);
            colorPanel.setPreferredSize(new Dimension(30,30));
            colorPanel.addMouseListener(new MouseAdapter() {
                @Override
                public void mousePressed(MouseEvent e){
                    drawingPanel.setCurrentColor(color);
                }
            });
            toolPanel.add(colorPanel);
        }

        frame.add(toolPanel, BorderLayout.NORTH);

        frame.setSize(800,600);
        frame.setVisible(true);
    }
}
