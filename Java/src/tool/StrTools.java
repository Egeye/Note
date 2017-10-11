package tool;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StrTools {

    /**
     * 提取固定格式字符串中的数字，整数、double、负数都可以
     *
     * @param ptCasinoMsg 字符串目标
     * @return 字符串数组
     */
    public static String[] getNum(String ptCasinoMsg) {
        String returnAmounts[] = new String[4];
        if (!ptCasinoMsg.equals("")) {
            ptCasinoMsg = ptCasinoMsg.replace(" | ", " ");
            String[] amounts = ptCasinoMsg.split(" ");
            for (int i = 0; i < amounts.length; i++) {
                String msgAmount = amounts[i];
                String numFlag = "";
                if (msgAmount.contains("-")) {
                    numFlag = "-";
                }
                Pattern p = Pattern.compile("(\\d+\\.\\d+)");
                Matcher m = p.matcher(amounts[i]);
                if (m.find()) {
                    returnAmounts[i] = m.group(1) == null ? "" : numFlag + m.group(1);
                } else {
                    p = Pattern.compile("(\\d+)");
                    m = p.matcher(amounts[i]);
                    if (m.find()) {
                        returnAmounts[i] = m.group(1) == null ? "" : numFlag + m.group(1);
                    }
                }
            }
        } else {
            returnAmounts[0] = "";
            returnAmounts[1] = "";
            returnAmounts[2] = "";
            returnAmounts[3] = "";
        }

        return returnAmounts;
    }

    /**
     * 字符串中提取整数和小数部分，如果字符串中没有整数和小数部分，则设为空
     *
     * @param str 字符串目标
     * @return 数字字符串
     */
    public static String getMathNum(String str) {
        // 需要取整数和小数的字符串
        // String str = "需要提取的字符串1.111";
        // 控制正则表达式的匹配行为的参数(小数)
        Pattern p = Pattern.compile("(\\d+\\.\\d+)");
        //Matcher类的构造方法也是私有的,不能随意创建,只能通过Pattern.matcher(CharSequence input)方法得到该类的实例.
        Matcher m = p.matcher(str);
        //m.find用来判断该字符串中是否含有与"(\\d+\\.\\d+)"相匹配的子串
        if (m.find()) {
            //如果有相匹配的,则判断是否为null操作
            //group()中的参数：0表示匹配整个正则，1表示匹配第一个括号的正则,2表示匹配第二个正则,在这只有一个括号,即1和0是一样的
            str = m.group(1) == null ? "" : m.group(1);
        } else {
            //如果匹配不到小数，就进行整数匹配
            p = Pattern.compile("(\\d+)");
            m = p.matcher(str);
            if (m.find()) {
                //如果有整数相匹配
                str = m.group(1) == null ? "" : m.group(1);
            } else {
                //如果没有小数和整数相匹配,即字符串中没有整数和小数，就设为空
                str = "";
            }
        }
        return str;
    }

    public static void main(String[] args) {
        String[] cc = getNum("日单量：100 | 交易额度：55.6 | 总额度：55.7 | 优惠额：-33.4");

        for (String s : cc) {
            System.out.println(s);
        }
    }
}
