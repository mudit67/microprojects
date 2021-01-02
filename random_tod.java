import java.io.*;
public class random_tod{
	public static void main(String[] args) throws IOException{
		InputStreamReader read = new InputStreamReader(System.in);
		BufferedReader br = new BufferedReader(read);
		String names[] = new String[4];
		names[0]="Daksh";names[1]="Kushagra";names[2]="Mudit";names[3]="Parth";
		System.out.println(getRandomNumber(0,3));
		// System.out.println("Enter 1 to continue and 0 to exit");
		// int ch = Integer.parseInt(br.readLine());
		// int prevAsk=0,ask = 1,prevAns=0,ans=1;
		// while(ch!=0){
		// 	prevAsk=ask;
		// 	while(prevAsk==ask){
		// 		ask=getRandomNumber(0,3);	
		// 	}
		// 	System.out.println(names[ask] + " Will ask the Question to.......");
		// 	ans=getRandomNumber(0,3);
		// 	while(ask==ans){
		// 		while(prevAns==ans){
		// 			ans=getRandomNumber(0,3);
		// 		}
		// 	}
		// 	System.out.println(names[ans]);
		// 	System.out.println("\n\n\n Enter 1 to continue and 0 to exit \n\n\n");
		// 	ch=Integer.parseInt(br.readLine());
		// }
	}
	public static int getRandomNumber(int min, int max) {
    	return (int) ((Math.random() * (max - min)) + min);
	}
}