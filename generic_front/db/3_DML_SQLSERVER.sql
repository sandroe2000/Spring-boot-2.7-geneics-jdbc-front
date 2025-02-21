-- Active: 1740139247655@@127.0.0.1@1433@model

drop table generic_metadata;

create table generic_metadata (
    metadata_id bigint IDENTITY(1, 1),
    _sql VARCHAR(4000),
    _limit VARCHAR(10),
    _offset VARCHAR(10),
    primary key (metadata_id)
);


drop table generic_fields;

create table generic_fields (
    field_id bigint IDENTITY(1, 1),
    _key VARCHAR(255),
    _value VARCHAR(255),
    primary key (field_id),
    metadata_id bigint REFERENCES generic_metadata (metadata_id)  ON DELETE CASCADE
);


drop table generic_parameters;

create table generic_parameters (
    parameter_id bigint IDENTITY(1, 1),
    _key VARCHAR(255),
    _value VARCHAR(255),
    primary key (parameter_id),
    metadata_id bigint REFERENCES generic_metadata (metadata_id)  ON DELETE CASCADE
);


SELECT
    C.ORDINAL_POSITION          AS ORDINAL_POSITION,
    C.TABLE_SCHEMA              AS tableSchema,
    C.TABLE_NAME                AS tableName,
    C.COLUMN_NAME               AS columnName,
    C.DATA_TYPE                 AS dataType,
    C.CHARACTER_MAXIMUM_LENGTH  AS maxLength,
    C.IS_NULLABLE               AS isNullable,
    TC.CONSTRAINT_TYPE          AS constraintType,
    CASE WHEN TC.CONSTRAINT_TYPE = 'FOREIGN KEY' THEN CCU.TABLE_NAME ELSE NULL  END AS fkTableName
FROM
    INFORMATION_SCHEMA.COLUMNS C
    LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE KCU 
        ON C.TABLE_SCHEMA = KCU.TABLE_SCHEMA
        AND C.TABLE_NAME = KCU.TABLE_NAME
        AND C.COLUMN_NAME = KCU.COLUMN_NAME
    LEFT JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS TC 
        ON TC.CONSTRAINT_NAME = KCU.CONSTRAINT_NAME
    LEFT JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS RC 
        ON TC.CONSTRAINT_NAME = RC.CONSTRAINT_NAME
    LEFT JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE CCU 
        ON RC.UNIQUE_CONSTRAINT_NAME = CCU.CONSTRAINT_NAME
WHERE
    C.TABLE_NAME LIKE 'CS_CDTB_PESSOAEND_PEEN'
ORDER BY
    C.TABLE_SCHEMA,
    C.TABLE_NAME,
    C.ORDINAL_POSITION