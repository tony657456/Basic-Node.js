package test;

/**
 * test
 */
public class test {
    public static void main(String[] args) {
        int i,j,z;

            for(i = 0; i <= 4; i++){
                for(j = 1; 3 - j >= 0; j++){
                    System.out.print(' ');
                }
                for(z = 1; z <= 2*i+1; z++);{
                    System.out.print('*');
                }
                
            System.out.println();
    }
  } 
}