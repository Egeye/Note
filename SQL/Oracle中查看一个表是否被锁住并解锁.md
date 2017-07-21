#### 处理步骤：
1. 先从user_objects中查询到该表的object_id:
> select object_id from user_objects where object_name=upper('表名');


2. 根据查到的object_id知道使用该表的session：
> select sid from v$lock where id1=&object_id;


3. 在从v$session视图中查到该session的SID和SERIAL#：
> select SID,SERIAL# from v$session where sid=181;


4. 杀掉这些进程:
> alter system kill session 'SID,SERIAL#';



select object_id from user_objects where object_name=upper('表名');
select sid from v$lock where id1=&object_id;
select SID,SERIAL# from v$session where sid=181;
alter system kill session 'SID,SERIAL#';
