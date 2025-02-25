-- Active: 1739464089839@@localhost@5432@pessoa
alter table if exists endereco drop constraint if exists FKn1l2g0b74rqd9ywu29sva9sy9;
alter table if exists pessoa drop constraint if exists FKpy60u8xp7jr025f5l4dbnah4i;

drop table if exists endereco cascade;
drop table if exists estado_civil cascade;
drop table if exists forma_tratamento cascade;
drop table if exists genero cascade;
drop table if exists nao_contactar_por cascade;
drop table if exists pessoa cascade;
drop table if exists tipo_publico cascade;

create table endereco (inativo boolean default false not null, endereco_id bigint generated by default as identity, pessoa_id bigint, bairro_distrito varchar(255), cep varchar(255), complemento varchar(255), localidade_cidade varchar(255), logradouro varchar(255), numero varchar(255), tipo varchar(255) check (tipo in ('COMERCIAL','RESIDENCIAL','OUTROS')), uf varchar(255), primary key (endereco_id));

create table estado_civil (
    inativo boolean default false not null, 
    estado_civil_id bigint generated by default as identity, 
    descricao varchar(255), 
    pessoa_id bigint,
    primary key (estado_civil_id)
);
create table forma_tratamento (inativo boolean default false not null, forma_tratamento_id bigint generated by default as identity, pessoa_id bigint, descricao varchar(255), primary key (forma_tratamento_id));
create table genero (inativo boolean default false not null, genero_id bigint generated by default as identity, pessoa_id bigint, descricao varchar(255), primary key (genero_id));
create table nao_contactar_por (correio boolean default false not null, pessoa_id bigint, email boolean default false not null, sms boolean default false not null, telefone boolean default false not null, whats_app boolean default false not null, nao_contactar_por_id bigint generated by default as identity, primary key (nao_contactar_por_id));

create table pessoa (
    inativo boolean default false not null, 
    tel_celular_principal boolean not null, 
    data_nascimento timestamp(6), 
    estado_civil_id bigint, 
    forma_tratamento_id bigint, 
    genero_id bigint, 
    pessoa_id bigint generated by default as identity, 
    tipo_publico_id bigint unique, 
    cargo varchar(255), 
    codigo_corporativo varchar(255), 
    cpf_cnpj varchar(255), 
    email_alternativo varchar(255), 
    email_principal varchar(255), 
    empresa varchar(255), 
    nome_razao_social varchar(255), 
    passaporte varchar(255), 
    profissao varchar(255), 
    rg_ie varchar(255), 
    tel_celular varchar(255), 
    tel_comercial varchar(255), 
    tipo_pessoa varchar(255) check (tipo_pessoa in ('FISICA','JURIDICA')), 
    primary key (pessoa_id)
);

create table tipo_publico (inativo boolean default false not null, tipo_publico_id bigint generated by default as identity, descricao varchar(255), primary key (tipo_publico_id));
alter table if exists estado_civil add constraint FKn1l2g0b74rqd9ywu29sva9sy4 foreign key (pessoa_id) references pessoa;
alter table if exists genero add constraint FKn1l2g0b74rqd9ywu29sva9sy4 foreign key (pessoa_id) references pessoa;
alter table if exists forma_tratamento add constraint FKn1l2g0b74rqd9ywu29sva9sy4 foreign key (pessoa_id) references pessoa;
alter table if exists nao_contactar_por add constraint FKn1l2g0b74rqd9ywu29sva9sy4 foreign key (pessoa_id) references pessoa;
alter table if exists endereco add constraint FKn1l2g0b74rqd9ywu29sva9sy9 foreign key (pessoa_id) references pessoa;
alter table if exists pessoa add constraint FKpy60u8xp7jr025f5l4dbnah4i foreign key (tipo_publico_id) references tipo_publico;