package com.didichuxing.decision.entity;

/**
 * Created by didi on 2017/10/27.
 */
public class Datasrc {

    private long id;
    private String hiveTable;
    private String alias;
    private String logicTable;
    private String primaryKey;
    private String extractKey;
    private String path;
    private String createTime;
    private String modifyTime;
    private String group;
    private int status;
    private int backDays;
    private int priority;
    private int logicalBack;
    private String fusionTable;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getHiveTable() {
        return hiveTable;
    }

    public void setHiveTable(String hiveTable) {
        this.hiveTable = hiveTable;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public String getLogicTable() {
        return logicTable;
    }

    public void setLogicTable(String logicTable) {
        this.logicTable = logicTable;
    }

    public String getPrimaryKey() {
        return primaryKey;
    }

    public void setPrimaryKey(String primaryKey) {
        this.primaryKey = primaryKey;
    }

    public String getExtractKey() {
        return extractKey;
    }

    public void setExtractKey(String extractKey) {
        this.extractKey = extractKey;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
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

    public String getGroup() {
        return group;
    }

    public void setGroup(String group) {
        this.group = group;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public int getBackDays() {
        return backDays;
    }

    public void setBackDays(int backDays) {
        this.backDays = backDays;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }

    public int getLogicalBack() {
        return logicalBack;
    }

    public void setLogicalBack(int logicalBack) {
        this.logicalBack = logicalBack;
    }

    public String getFusionTable() {
        return fusionTable;
    }

    public void setFusionTable(String fusionTable) {
        this.fusionTable = fusionTable;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("Datasrc[")
            .append("id=" + id)
            .append(", hiveTable=" + hiveTable)
            .append(", alias=" + alias)
            .append(", logicTable=" + logicTable)
            .append(", primaryKey=" + primaryKey)
            .append(", extractKey=" + extractKey)
            .append(", path=" + path)
            .append(", createTime=" + createTime)
            .append(", modifyTime=" + modifyTime)
            .append(", group=" + group)
            .append(", status=" + status)
            .append(", backDays=" + backDays)
            .append(", priority=" + priority)
            .append(", logicalBack=" + logicalBack)
            .append(", fusionTable=" + fusionTable)
            .append("]");

        return sb.toString();
    }
}
