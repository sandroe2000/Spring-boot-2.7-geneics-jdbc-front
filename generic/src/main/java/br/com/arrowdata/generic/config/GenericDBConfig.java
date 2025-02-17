package br.com.arrowdata.generic.config;

import org.springframework.context.annotation.Configuration;
/*import java.util.HashMap;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.core.env.Environment;*/

@Configuration
//@EnableJpaRepositories(
//		basePackages = "br.com.arrowdata.generic", 
//		entityManagerFactoryRef = "genericEntityManager", 
//		transactionManagerRef = "genericTransactionManager")
public class GenericDBConfig {
/*
    @Autowired
	private Environment env;

	@Bean
	public LocalContainerEntityManagerFactoryBean genericEntityManager() {
		LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
		em.setDataSource(genericDataSource());
		em.setPackagesToScan(new String[] { "br.com.arrowdata.generic" });

		HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
		em.setJpaVendorAdapter(vendorAdapter);
		HashMap<String, Object> properties = new HashMap<>();
		properties.put("hibernate.hbm2ddl.auto", env.getProperty("hibernate.hbm2ddl.auto"));
		properties.put("hibernate.dialect", env.getProperty("hibernate.dialect"));
		em.setJpaPropertyMap(properties);

		return em;
	}

    @Bean
	@ConfigurationProperties(prefix = "spring.datasource")
	public DataSource genericDataSource() {
		return DataSourceBuilder.create().build();
	}

    @Bean
	public PlatformTransactionManager genericTransactionManager() {

		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager.setEntityManagerFactory(genericEntityManager().getObject());
		return transactionManager;
	}
 */   
}
