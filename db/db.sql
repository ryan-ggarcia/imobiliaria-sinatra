
CREATE TABLE `tb_perfil` (
  `per_id` int NOT NULL AUTO_INCREMENT,
  `per_descricao` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`per_id`)
) ENGINE=InnoDB AUTO_INCREMENT=0;

CREATE TABLE `tb_usuario` (
  `usu_id` int NOT NULL AUTO_INCREMENT,
  `usu_nome` varchar(200) DEFAULT NULL,
  `usu_email` varchar(100) DEFAULT NULL,
  `usu_ativo` bool,
  `usu_senha` varchar(100) DEFAULT NULL,
  `per_id` int DEFAULT NULL,
  PRIMARY KEY (`usu_id`),
  KEY `fk_usuario_perfil` (`per_id`),
  CONSTRAINT `fk_usuario_perfil` FOREIGN KEY (`per_id`) REFERENCES `tb_perfil` (`per_id`)
) ENGINE=InnoDB AUTO_INCREMENT=0;


insert into tb_perfil (per_descricao) values ('Administrador');
insert into tb_perfil (per_descricao) values ('Locatário');

create table tb_imovel (
    imv_id int not null auto_increment primary key,
    imv_descricao varchar(200),
    imv_cep varchar(20),
    imv_endereco varchar(200),
    imv_bairro varchar(100),
    imv_cidade varchar(100),
    imv_valor decimal(6,2),
    imv_disponivel char(1)
);

create table tb_contrato(
	ctr_id int not null auto_increment primary key,
    imv_id int,
	usu_id int,
	constraint fk_contrato_imovel foreign key (imv_id) references tb_imovel (imv_id),
	constraint fk_contrato_usuario foreign key (usu_id) references tb_usuario (usu_id)
);

create table tb_aluguel (
    alu_id int not null auto_increment primary key,
    alu_mes int,
	alu_vencimento date,
    alu_valor decimal (6,2),
    alu_pago char (1),
    ctr_id int,
    constraint fk_aluguel_contrato foreign key (ctr_id) references tb_contrato (ctr_id)
);