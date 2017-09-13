package tool;

import java.text.SimpleDateFormat;
import java.util.*;

public class CommonTools {
    /**
     * 获取文件名不带拓展名
     *
     * @param filename 文件名
     * @return 文件名(不带拓展名)
     */
    public static String getFileNameNoEx(String filename) {
        if ((filename != null) && (filename.length() > 0)) {
            int dot = filename.lastIndexOf('.');
            if ((dot > -1) && (dot < (filename.length()))) {
                return filename.substring(0, dot);
            }
        }
        return filename;
    }

    /**
     * 获取文件扩展名
     *
     * @param filename 文件名
     * @return 扩展名
     */
    public static String getExtensionName(String filename) {
        if ((filename != null) && (filename.length() > 0)) {
            int dot = filename.lastIndexOf('.');
            if ((dot > -1) && (dot < (filename.length() - 1))) {
                return filename.substring(dot + 1);
            }
        }
        return filename;
    }

    /**
     * 获取当前时间
     *
     * @param pattern yyyyMMddHHmmss
     * @return 时间字符串
     */
    public static String getCurrentTime(String pattern) {
        SimpleDateFormat df = new SimpleDateFormat(pattern);
        return df.format(new Date());
    }
}
