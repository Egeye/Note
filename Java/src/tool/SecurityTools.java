package tool;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import javax.crypto.*;
import javax.crypto.spec.DESedeKeySpec;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;

/**
 * 安全工具（加密解密）
 */
public class SecurityTools {

    /**
     * 默认数字签名算法（指纹认证），可用MD5、SHA
     */
    public static final String ALGORITHM_SHA = "SHA";

    /**
     * 操作模式，加密或解密
     */
    public static enum CIPHER_MODE {
        ENCRYPT_MODE, DECRYPT_MODE
    }

    /**
     * 数字签名
     *
     * @param algorithm 算法，如：md5、sha
     * @param encoding
     * @param src
     * @return
     */
    public static byte[] digest(String algorithm, String encoding, String src) {

        byte[] b = null;
        try {
            MessageDigest md = MessageDigest.getInstance(algorithm);
            b = md.digest(src.getBytes(encoding));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return b;
    }

    /**
     * BASE64加密
     *
     * @param src
     * @param encoding
     * @return
     */
    private static BASE64Encoder b64encoder = new BASE64Encoder();

    public static String base64Encoder(String src, String encoding) {

        String ciphertext = null;
        try {
            ciphertext = b64encoder.encode(src.getBytes(encoding));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return ciphertext;
    }

    /**
     * BASE64加密
     *
     * @param src
     * @return
     */
    public static String base64Encoder(byte[] src) {

        return b64encoder.encode(src);
    }

    /**
     * BASE64解密
     *
     * @param dest
     * @param encoding
     * @return
     */
    private static BASE64Decoder b64decoder = new BASE64Decoder();

    public static String base64Decoder(String dest, String encoding) {

        byte[] b = null;
        try {
            b = b64decoder.decodeBuffer(dest);
        } catch (IOException e) {
            e.printStackTrace();
        }
        String plaintext = null;
        try {
            plaintext = new String(b, encoding);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return plaintext;
    }

    /**
     * BASE64解密
     *
     * @param dest
     * @return
     */
    public static byte[] base64Decoder(String dest) {

        byte[] b = null;
        try {
            b = b64decoder.decodeBuffer(dest);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return b;
    }

    /**
     * 构造DESede对称密钥
     *
     * @param key
     * @return
     */
    public static SecretKey getDESedeKey(byte[] key) {

        SecretKey desKey = null;
        try {
            DESedeKeySpec desKeySpec = new DESedeKeySpec(key);
            desKey = SecretKeyFactory.getInstance("DESede").generateSecret(desKeySpec);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return desKey;
    }

    /**
     * 生成非对称密钥，使用时注意公钥和私钥
     *
     * @param algorithm 非对称密钥算法，如：RSA
     * @return
     */
    public static KeyPair createKeyPair(String algorithm) {

        KeyPair key = null;
        try {
            key = KeyPairGenerator.getInstance(algorithm).generateKeyPair();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return key;
    }

    /**
     * 生成对称密钥
     *
     * @param algorithm 对称密钥算法，如：DES，DESede
     * @return
     */
    public static SecretKey createSecretKey(String algorithm) {

        SecretKey key = null;
        try {
            key = KeyGenerator.getInstance(algorithm).generateKey();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }

        return key;
    }

    /**
     * 使用keySpec创建对称密钥
     *
     * @param algorithm
     * @param keySpec
     * @return
     */
    public static SecretKey createSecretKey(String algorithm, KeySpec keySpec) {

        SecretKey key = null;
        try {
            SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(algorithm);
            key = keyFactory.generateSecret(keySpec);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return key;
    }

    /**
     * 读取X509公钥
     *
     * @param algorithm
     * @return
     */
    public static PublicKey getPublicKey(String algorithm, KeySpec keySpec) {

        PublicKey pubKey = null;
        try {
            pubKey = KeyFactory.getInstance(algorithm).generatePublic(keySpec);
        } catch (InvalidKeySpecException e) {
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return pubKey;
    }

    /**
     * 获得私钥
     *
     * @param algorithm
     * @param keySpec
     * @return
     */
    public static PrivateKey getPrivateKey(String algorithm, KeySpec keySpec) {

        PrivateKey priKey = null;
        try {
            priKey = KeyFactory.getInstance(algorithm).generatePrivate(keySpec);
        } catch (InvalidKeySpecException e) {
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return priKey;
    }

    /**
     * 加密或解密字符串
     *
     * @param plaintext
     * @return
     */
    public static byte[] doFinal(Key key, byte[] plaintext, CIPHER_MODE opmod) {

        byte[] ciphertext = null;
        try {
            Cipher cipher = Cipher.getInstance(key.getAlgorithm());
            // 操作模式（加密或解密）
            if (opmod == CIPHER_MODE.ENCRYPT_MODE) {
                cipher.init(Cipher.ENCRYPT_MODE, key);
            } else if (opmod == CIPHER_MODE.DECRYPT_MODE) {
                cipher.init(Cipher.DECRYPT_MODE, key);
            }
            ciphertext = cipher.doFinal(plaintext);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ciphertext;
    }

    /**
     * 得到加密或解密输入流
     *
     * @param key
     * @param is
     * @param opmod
     * @throws IOException
     */
    public static CipherInputStream doFinal(Key key, InputStream is, CIPHER_MODE opmod) {

        CipherInputStream cis = null;
        try {
            Cipher cipher = Cipher.getInstance(key.getAlgorithm());
            // 操作模式（加密或解密）
            if (opmod == CIPHER_MODE.ENCRYPT_MODE) {
                cipher.init(Cipher.ENCRYPT_MODE, key);
            } else if (opmod == CIPHER_MODE.DECRYPT_MODE) {
                cipher.init(Cipher.DECRYPT_MODE, key);
            }
            cis = new CipherInputStream(is, cipher);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return cis;
    }

    /**
     * 得到加密或解密输出流
     *
     * @param key
     * @param os
     * @param opmod
     */
    public static CipherOutputStream doFinal(Key key, OutputStream os,
                                             CIPHER_MODE opmod) {

        CipherOutputStream cos = null;
        try {
            Cipher cipher = Cipher.getInstance(key.getAlgorithm());
            // 操作模式（加密或解密）
            if (opmod == CIPHER_MODE.ENCRYPT_MODE) {
                cipher.init(Cipher.ENCRYPT_MODE, key);
            } else if (opmod == CIPHER_MODE.DECRYPT_MODE) {
                cipher.init(Cipher.DECRYPT_MODE, key);
            }
            cos = new CipherOutputStream(os, cipher);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return cos;
    }

    /**
     * 验证数字签名
     *
     * @param publicKey
     * @param algorithm 签名算法
     * @param sign      私钥签名的signature
     * @param data      签名的数据
     * @return
     */
    public static boolean signVerify(PublicKey publicKey, String algorithm, byte[] sign, byte[] data) {

        boolean flag = false;
        try {
            Signature signagure = Signature.getInstance(algorithm);
            signagure.initVerify(publicKey);
            signagure.update(data);
            flag = signagure.verify(sign);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return flag;
    }

    /**
     * 用私钥对信息进行数字签名
     *
     * @param privateKey key
     * @param algorithm  签名算法
     * @param data       签名的数据
     * @return
     */
    public static byte[] sign(PrivateKey privateKey, String algorithm,
                              byte[] data) {

        byte[] sign = null;
        try {
            Signature signature = Signature.getInstance(algorithm);
            signature.initSign(privateKey);
            signature.update(data);
            sign = signature.sign();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return sign;
    }

    /**
     * SHA数字签名
     *
     * @param src
     * @return
     * @throws Exception
     * @author panguixiang
     */
    public static byte[] shaDigest(String src) {

        byte[] b = null;
        try {
            MessageDigest md = MessageDigest.getInstance(ALGORITHM_SHA);
            b = md.digest(src.getBytes());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return b;
    }

    /**
     * 字节数组转为最大写16进制字符串
     *
     * @param b
     * @return
     * @author panguixiang
     */
    public static String byte2HexStr(byte[] b) {

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < b.length; i++) {
            String s = Integer.toHexString(b[i] & 0xFF);
            if (s.length() == 1) {
                sb.append("0");
            }

            sb.append(s.toUpperCase());
        }

        return sb.toString();
    }
}
