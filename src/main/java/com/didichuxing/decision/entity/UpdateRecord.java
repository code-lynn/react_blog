package com.didichuxing.decision.entity;

/**
 * Created by didi on 2017/9/22.
 */
public class UpdateRecord {

    private long id;
    private String title;
    private String publisher;
    private String content;
    private String createTime;
    private String modifyTime;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getModifyTime() {
        return modifyTime;
    }

    public void setModifyTime(String modifyTime) {
        this.modifyTime = modifyTime;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("UpdateRecord [")
            .append("id=" + id)
            .append(", title=" + title)
            .append(", publisher=" + publisher)
            .append(", content=" + content)
            .append(", createTime=" + createTime)
            .append(", modifyTime=" + modifyTime)
            .append("]");

        return sb.toString();
    }
}
