package com.didichuxing.decision.entity;

import java.io.Serializable;

/**
 * Created by didi on 2017/9/21.
 */
public class Role implements Serializable{

    private long id;
    private String name;
    private String group;
    private int role;
    private int callerRole;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGroup() {
        return group;
    }

    public void setGroup(String group) {
        this.group = group;
    }

    public int getRole() {
        return role;
    }

    public void setRole(int role) {
        this.role = role;
    }

    public int getCallerRole() {
        return callerRole;
    }

    public void setCallerRole(int callerRole) {
        this.callerRole = callerRole;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("Role [")
            .append("user_id=" + id)
            .append(", user_name=" + name)
            .append(", group=" + group)
            .append(", role=" + role)
            .append(", caller_role=" + callerRole)
            .append("]");

        return sb.toString();
    }
}
