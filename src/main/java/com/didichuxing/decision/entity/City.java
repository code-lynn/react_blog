package com.didichuxing.decision.entity;

/**
 * Created by didi on 2017/9/26.
 */
public class City {

    private long id;
    private String listNum;
    private String chineseName;
    private String pinYin;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getListNum() {
        return listNum;
    }

    public void setListNum(String listNum) {
        this.listNum = listNum;
    }

    public String getChineseName() {
        return chineseName;
    }

    public void setChineseName(String chineseName) {
        this.chineseName = chineseName;
    }

    public String getPinYin() {
        return pinYin;
    }

    public void setPinYin(String pinYin) {
        this.pinYin = pinYin;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("City[")
            .append("id=" + id)
            .append(", listNum=" + listNum)
            .append(", chineseName=" + chineseName)
            .append(", pinYin=" + pinYin)
            .append("]");

        return sb.toString();
    }
}
