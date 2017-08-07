-- 注意：序列名区分大小写
-- 查看当前序列
select * from user_sequences where sequence_name like 'OPRT_CFG_REVISION_ID_SEQ%';

CREATE SEQUENCE sequence_name
START WITH 1000                   --START WITH num
INCREMENT BY 1                    --INCREMENT BY increment
MAXVALUE 999999999                --MAXVALUE num|NOMAXVALUE
MINVALUE 1000                     --MINVALUE num|NOMINVALUE
NOCYCLE                           --CYCLE|NOCYCLE
CACHE 20                          --CACHE num|NOCACHE
