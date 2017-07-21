-- 命令进入sql模式
-- 1. su - oracle
-- 2. $sqlplus
-- 3. desc table;
----------------------------------------------------------------------------------------------------

select ocr.accont_inst_id from oprt_cfg_resource ocr where ocr.revision_id = 2283 AND ACCONT_INST_FLG=0;

select ocr.accont_inst_id from oprt_cfg_resource ocr where ocr.accont_inst_flg=0 and ocr.revision_id = 2283;

select ocr.accont_inst_id from oprt_cfg_resource ocr where ocr.revision_id = 2336;

UPDATE OPRT_CFG_RESOURCE set ACCONT_INST_FLG=1 WHERE ACCONT_INST_ID = 900000123423795 AND REVISION_ID =2283;

select ocr.accont_inst_id from oprt_cfg_resource ocr where ocr.accont_inst_flg=1 and ocr.revision_id = 2283;

select * from oprt_cfg_resource ocr where ACCONT_INST_FLG = 1;

select ocr.* from oprt_cfg_revision ocr where ocr.revision_id = (select head_revision from oprt_cfg where cfg_id = 1902);

SELECT * FROM oprt_cfg_resource WHERE ACCONT_INST_FLG=1;

SELECT * FROM oprt_cfg_resource WHERE revision_id = 2283;

SELECT * FROM oprt_cfg_resource WHERE revision_id = 1741;

select * from oprt_cfg_resource;

select * from oprt_cfg_resource ocr where ocr.revision_id = 2283;

COMMIT;

truncate table OPRT_CFG_RESOURCE_FILE;

SELECT * FROM OPRT_CFG_RESOURCE_FILE;

create table OPRT_CFG_RESOURCE_FILE as select * from OPRT_CFG_RESOURCE;

-- 900000123423795
select b.instance_id       ci_inst_id,
       c.instance_id       accont_inst_id,
       c.short_description user_id,
  d.password,
  b.short_description,
       e.local_point port,
       nvl(f.connect_str,g.connect_str)          conn_str,
       decode(f.connect_str,null,'MySQL','Oracle') db_type,
       (
         select b1.short_description
         from ci_base_relationship a1, ci_base_element b1
         where a1.source_instance_id = b.instance_id
               and a1.destination_instance_id = b1.instance_id
               and b1.class_id = 10
               and a1.markasdeleted=0
               and b1.markasdeleted=0
               and a1.name = 'HOSTED_IP'
       ) ip
from ci_base_relationship a, ci_base_element b, ci_base_element c,ci_user d,ci_computer_system e,ci_oracle f,ci_mysql g
where a.destination_instance_id = 900000123409199
      and a.name = 'HOSTED_SYSTEM_COMPONENTS'
      and a.class_id = 6
      and a.source_instance_id = b.instance_id
      and c.instance_id = a.destination_instance_id
      and d.instance_id = c.instance_id
      and b.markasdeleted = 0
      and c.markasdeleted = 0
      and b.instance_id = e.instance_id(+)
      and b.instance_id = f.instance_id(+)
      and b.instance_id = g.instance_id(+);


ALTER TABLE OPRT_CFG_RESOURCE_FILE ADD SCRIPT_ID NUMBER(9)
  constraint FK_OPRT_VER_REFERENCE_OPRT_SCR
  references OPRT_SCRIPT;

----------------------------------------------------------------------------------------------------
-- 添加字段的语法：
alter table tablename add (column datatype [default value][null/not null],….);

-- 修改字段的语法：
alter table tablename modify (column datatype [default value][null/not null],….);

-- 删除字段的语法：
alter table tablename drop (column);

-- 添加、修改、删除多列的话，用逗号隔开。



-- 创建表结构：
create table test1
(id varchar2(20) not null);

-- 增加一个字段：
alter table test1
add (name varchar2(30) default ‘无名氏’ not null);

-- 使用一个SQL语句同时添加三个字段：
alter table test1
add (name varchar2(30) default ‘无名氏’ not null,
age integer default 22 not null,
has_money number(9,2)
);

-- 修改一个字段
alter table test1
modify (name varchar2(16) default ‘unknown’);


另：比较正规的写法是：
-- Add/modify columns
alter table TABLE_NAME rename column FIELD_NAME to NEW_FIELD_NAME;

-- 删除一个字段
alter table test1
drop column name;

-- 需要注意的是如果某一列中已经存在值，如果你要修改的为比这些值还要小的列宽这样将会出现一个错误。
-- 例如前面如果我们插入一个值
insert into test1
values (’1′,’我们很爱你’);

-- 然后曾修改列：
alter table test1
modify (name varchar2(8));
-- 将会得到以下错误：
-- ERROR 位于第 2 行:
-- ORA-01441: 无法减小列长度, 因为一些值过大

---------------------------------------------------------------------------------------------------------------

-- 高级用法：
-- 重命名表
ALTER TABLE table_name RENAME TO new_table_name;

-- 修改列的名称
-- 语法：
ALTER TABLE table_name RENAME COLUMN supplier_name to sname;

-- 范例：
alter table s_dept rename column age to age1;

-- 附：创建带主键的表>>
create table student (
studentid int primary key not null,
studentname varchar(8),
age int);


-- 1、创建表的同时创建主键约束
-- （1）无命名
create table student (
studentid int primary key not null,
studentname varchar(8),
age int);
-- （2）有命名
create table students (
studentid int ,
studentname varchar(8),
age int,
constraint yy primary key(studentid));


-- 2、删除表中已有的主键约束
-- （1）无命名
可用 SELECT * from user_cons_columns;
查找表中主键名称得student表中的主键名为SYS_C002715
alter table student drop constraint SYS_C002715;
-- （2）有命名
alter table students drop constraint yy;


-- 3、向表中添加主键约束
alter table student add constraint pk_student primary key(studentid);
