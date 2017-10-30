package com.didichuxing.decision.dao;

import com.didichuxing.decision.entity.Datasrc;

import java.util.List;

/**
 * Created by didi on 2017/10/27.
 */
public interface DatasrcDao {

    List<Datasrc> selectByAlias(List<String> aliases);
}
