import javax.swing.JFrame;
import javax.swing.JTextField;
import javax.swing.JLabel;
import javax.swing.JButton;
import javax.swing.JOptionPane;
import javax.swing.SwingUtilities;
import java.awt.GridLayout;

public class SwingTemperatureApp extends JFrame {

    private JTextField celsiusField;
    private JTextField fahrenheitField;

    public SwingTemperatureApp() {
        setTitle("Swing Temperature Converter");
        setSize(300, 150);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new GridLayout(3, 2));

        // Add Components
        add(new JLabel("Celsius:"));
        celsiusField = new JTextField();
        add(celsiusField);

        add(new JLabel("Fahrenheit:"));
        fahrenheitField = new JTextField();
        add(fahrenheitField);

        // Convert buttons
        JButton celsiusToFahr = new JButton("Convert to Fahrenheit");
        celsiusToFahr.addActionListener(e -> {
            try {
                double celsius = Double.parseDouble(celsiusField.getText());
                double fahrenheit = celsius * 9 / 5 + 32;
                fahrenheitField.setText(String.format("%.2f", fahrenheit));
            } catch (NumberFormatException ex) {
                JOptionPane.showMessageDialog(
                        this,
                        "Invalid input",
                        "Error",
                        JOptionPane.ERROR_MESSAGE);
            }
        });
        add(celsiusToFahr);

        JButton fahrToCelsius = new JButton("Convert to Celsius");
        fahrToCelsius.addActionListener(e -> {
            try {
                double fahrenheit = Double.parseDouble(fahrenheitField.getText());
                double celsius = (fahrenheit - 32) * 5 / 9;
                celsiusField.setText(String.format("%.2f", celsius));
            } catch (NumberFormatException ex) {
                JOptionPane.showMessageDialog(
                        this,
                        "Invalid input",
                        "Error",
                        JOptionPane.ERROR_MESSAGE);
            }
        });
        add(fahrToCelsius);
    }

    // Main Method
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            SwingTemperatureApp swingTemperatureApp = new SwingTemperatureApp();
            swingTemperatureApp.setVisible(true);
        });
    }
}
