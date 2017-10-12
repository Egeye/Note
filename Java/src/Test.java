import tool.StrTools;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Test {

    public static void main(String[] args) {
        String str = "version1.1";
        String s = StrTools.getMathNum(str);
        System.out.println(s);
    }
}
