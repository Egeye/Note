1. su - oracle

2. $sqlplus

3. desc table;


select ocr.accont_inst_id from oprt_cfg_resource ocr where ocr.revision_id = 2283 AND ACCONT_INST_FLG=0;
select ocr.accont_inst_id from oprt_cfg_resource ocr where ocr.accont_inst_flg=0 and ocr.revision_id = 2283;

select ocr.accont_inst_id from oprt_cfg_resource ocr where ocr.revision_id = 2336;
-- 2336
-- 2283

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


-- 900000123408369
-- 900000123409199
-- 900000123413238
-- 900000123423794
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
