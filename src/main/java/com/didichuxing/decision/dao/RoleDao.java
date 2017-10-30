package com.didichuxing.decision.dao;

import com.didichuxing.decision.entity.Role;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by didi on 2017/9/21.
 */
public interface RoleDao {
    List<Role> selectByRole(@Param("role") int role);
}
