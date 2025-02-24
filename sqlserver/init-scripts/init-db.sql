-- Active: 1740084242082@@127.0.0.1@1433@model
CREATE DATABASE model;
GO

IF OBJECT_ID(N'[dbo].[generic_metadata]', 'U') IS NULL
BEGIN
    create table generic_metadata (
        metadata_id bigint IDENTITY(1, 1),
        _sql VARCHAR(4000),
        _limit VARCHAR(10),
        _offset VARCHAR(10),
        primary key (metadata_id)
    )
END;
GO

IF OBJECT_ID(N'[dbo].[generic_fields]', 'U') IS NULL
BEGIN
    create table generic_fields (
        field_id bigint IDENTITY(1, 1),
        _key VARCHAR(255),
        _value VARCHAR(255),
        primary key (field_id),
        metadata_id bigint REFERENCES generic_metadata (metadata_id)  ON DELETE CASCADE
    )
END;
GO

IF OBJECT_ID(N'[dbo].[generic_parameters]', 'U') IS NULL
BEGIN
    create table generic_parameters (
        parameter_id bigint IDENTITY(1, 1),
        _key VARCHAR(255),
        _value VARCHAR(255),
        primary key (parameter_id),
        metadata_id bigint REFERENCES generic_metadata (metadata_id)  ON DELETE CASCADE
    )
END;
GO

IF OBJECT_ID(N'[dbo].[generic_configs]', 'U') IS NULL
BEGIN
    create table generic_configs (
        config_id bigint IDENTITY(1, 1),
        config_key VARCHAR(255),
        config_value VARCHAR(255),
        primary key (config_id)
    )
END;
GO