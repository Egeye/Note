public class Matcher {
    public static void main(String[] args) {
        // 正则替换java字符串中的中括号
        String a = "[1,2,3]";
        String b = a.replaceAll("[\\[\\]]", "");
        System.out.println(b);// b=1,2,3
    }
}
