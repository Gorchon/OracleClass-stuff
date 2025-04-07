public class BankAccount {

    private int balance = 1000;
    private final Object lock = new Object(); // Explicit lock object

    public void withdraw(int amount) {
        synchronized (lock) {
            while (balance < amount) {
                try {
                    System.out.println(Thread.currentThread().getName() + " waiting to withdraw $" + amount);
                    lock.wait(); // Releases lock and waits
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            balance -= amount;
            System.out.println(Thread.currentThread().getName() + " withdrew $" + amount);
            System.out.println("New balance: $" + balance);
        }
    }

    public void deposit(int amount) {
        synchronized (lock) {
            balance += amount;
            System.out.println(Thread.currentThread().getName() + " deposited $" + amount);
            System.out.println("New balance: $" + balance);
            lock.notifyAll(); // Notify all waiting threads
        }
    }

    public static void main(String[] args) {
        BankAccount account = new BankAccount();

        // Withdrawal thread
        Thread withdrawalThread = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                account.withdraw(600);
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                }
            }
        }, "Withdrawal Thread");

        // Deposit thread
        Thread depositThread = new Thread(() -> {
            for (int i = 0; i < 4; i++) {
                account.deposit(500);
                try {
                    Thread.sleep(700);
                } catch (InterruptedException e) {
                }
            }
        }, "Deposit Thread");

        withdrawalThread.start();
        depositThread.start();
    }
}
