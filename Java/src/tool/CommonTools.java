package tool;

import sun.misc.BASE64Encoder;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.Iterator;
import java.util.Map;

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

    /**
     * MD5加密计算
     *
     * @param signData 字符串集合
     * @return md5字符串
     */
    public static String getSign(Map<String, String> signData, String keygen) {
        String[] strKey = new String[signData.size()];
        Iterator iterator = signData.entrySet().iterator();
        for (int i = 0; i < signData.size(); i++) {
            Map.Entry entry = (Map.Entry) iterator.next();
            strKey[i] = (String) entry.getKey();
        }

        Arrays.sort(strKey);

        // 加密前处理
        StringBuilder encryptStr = new StringBuilder();
        for (String aStr : strKey) {
            encryptStr.append(signData.get(aStr)).append("|");
        }
        encryptStr.append(keygen);

        // 开始加密
        try {
            MessageDigest md5 = MessageDigest.getInstance("MD5");

            // 计算md5函数
            // md5.update(encryptStr.toString().getBytes());
            // digest()最后确定返回md5 hash值，返回值为8为字符串。因为md5 hash值是16位的hex值，实际上就是8位的字符
            // BigInteger函数则将8位的字符串转换成16位hex值，用字符串来表示；得到字符串形式的hash值
            // return new BigInteger(1, md5.digest()).toString(16);

            byte m5[] = md5.digest(encryptStr.toString().getBytes());
            BASE64Encoder encoder = new BASE64Encoder();
            return encoder.encode(m5).toLowerCase();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return "";
        }

    }
}
