# 🚀 Workshop de OCI AI Data Platform y Autonomous Database

Taller práctico para construir una solución de datos **de extremo a extremo en Oracle Cloud Infrastructure (OCI)** con **OCI AI Data Platform** y **Oracle Autonomous Database 26ai**.

A lo largo de los laboratorios, construirá un pipeline de datos completo: ingestión y procesamiento con **Apache Spark**, implementación de la **arquitectura Medallón (Bronze, Silver y Gold)**, integración con **Autonomous Database**, automatización de procesos y exploración de datos mediante **Select AI, APEX, Data Redaction y ORDS**.

---

## 🎯 Objetivo

El objetivo de este workshop es demostrar de forma práctica cómo los servicios de Oracle Cloud pueden trabajar en conjunto para construir una plataforma de datos moderna.

El recorrido comienza con la ingestión y transformación de datos en **OCI AI Data Platform** y continúa en **Oracle Autonomous Database 26ai**, donde los conjuntos de datos procesados se usan para automatización, consultas en lenguaje natural, seguridad de datos y publicación de API REST.

### Arquitectura del workshop

```text
Archivos CSV
    │
    ▼
OCI AI Data Platform
    │
    ├── Bronze
    │     Datos sin procesar
    │
    ├── Silver
    │     Datos depurados y combinados
    │
    └── Gold
          Datos agregados
              │
              ▼
Oracle Autonomous Database 26ai
              │
              ├── Procedures
              ├── Oracle Scheduler
              ├── Select AI
              ├── Oracle APEX
              ├── Data Redaction
              └── ORDS / REST API
```

---

## 🧪 Laboratorios

El workshop se divide en dos partes principales.

### Parte 1 — OCI AI Data Platform

En esta etapa construirá un pipeline de datos con notebooks y Apache Spark.

Aprenderá a:

- Crear una instancia de **OCI AI Data Platform**;
- Configurar el catálogo, el volumen, el workspace y el clúster Spark;
- Cargar conjuntos de datos CSV;
- Realizar análisis exploratorio y controles de calidad;
- Crear las capas **Bronze**, **Silver** y **Gold**;
- Trabajar con **PySpark**;
- Integrar AI Data Platform con Autonomous Database;
- Replicar conjuntos de datos procesados a Autonomous Database;
- Crear un **Workflow** para orquestar los notebooks.

### Pipeline

```text
orders.csv ─────┐
                ├──► Bronze ──► Silver ──► Gold
customers.csv ──┘                           │
                                           ▼
                              Autonomous Database
```

La capa **Bronze** conserva los datos importados.

La capa **Silver** combina y prepara los datos de clientes y pedidos.

La capa **Gold** genera indicadores agregados, por ejemplo:

- cantidad de pedidos;
- ventas totales;
- ticket promedio;
- indicadores por categoría de cliente.

---

### Parte 2 — Oracle Autonomous Database 26ai

Después de construir el pipeline, el workshop continúa en **Oracle Autonomous Database 26ai**.

En esta etapa aprenderá a:

- Crear esquemas y usuarios;
- Configurar privilegios;
- Crear procedures para transformar y replicar datos;
- Automatizar ejecuciones con **Oracle Scheduler**;
- Configurar credenciales de OCI;
- Crear un perfil de **Select AI**;
- Consultar los datos con lenguaje natural;
- Usar **Oracle APEX**;
- Configurar **Data Redaction**;
- Crear servicios REST con **ORDS**.

---

## 🤖 Select AI

Una de las etapas del workshop muestra cómo usar **Select AI** para consultar los datos con lenguaje natural.

Ejemplos:

```text
¿Cuál es la cantidad de pedidos por delivery_type?
```

```text
¿Cuál es la cantidad de pedidos por customer_class?
```

```text
¿Cuáles son los pedidos realizados con el correo alfred.foley@yahoo.com?
```

```text
¿Cuál es la cantidad de pedidos por warehouse_id?
```

Select AI interpreta la pregunta y usa el contexto de las tablas para ayudar a generar las consultas correspondientes.

---

## 🔐 Data Redaction

El workshop también presenta un ejemplo de protección de información con **Oracle Data Redaction**.

Se aplica una política de redacción a la columna de correo electrónico de los clientes para mostrar cómo se pueden proteger los datos sensibles según el contexto de acceso.

---

## 🌐 API REST con ORDS

En la etapa final, los datos se publican mediante un endpoint REST con **Oracle REST Data Services (ORDS)**.

Ejemplo conceptual:

```text
Client
   │
   ▼
ORDS REST API
   │
   ▼
Autonomous Database
   │
   └── Data Redaction
```

Esto demuestra cómo los conjuntos de datos procesados por la plataforma pueden ponerse a disposición de aplicaciones y otros consumidores mediante API.

---

## 📁 Estructura del repositorio

```text
workshop-dataplatform/
│
├── aidataplatform/
│   └── Materiales del laboratorio de OCI AI Data Platform
│
├── autonomousdb/
│   └── Materiales del laboratorio de Autonomous Database
│
├── workshops/
│   └── Materiales relacionados con los workshops
│
├── 0-pt-config-lab/
│   └── Recursos de preparación y configuración del laboratorio
│
├── index.html
├── manifest.json
└── README.md
```

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| Oracle Cloud Infrastructure | Plataforma en la nube |
| OCI AI Data Platform | Plataforma de procesamiento de datos |
| Apache Spark | Procesamiento distribuido |
| PySpark | Transformación y análisis |
| Delta Tables | Persistencia de las capas de datos |
| Autonomous Database 26ai | Base de datos |
| PL/SQL | Procedures y automatizaciones |
| Oracle Scheduler | Orquestación en la base de datos |
| Select AI | Consultas en lenguaje natural |
| Oracle APEX | Aplicación demostrativa |
| Data Redaction | Protección de datos |
| ORDS | Publicación de API REST |

---

## 📋 Requisitos previos

Antes de comenzar, se recomienda contar con:

- Una cuenta de Oracle Cloud con acceso a los servicios utilizados;
- Permisos para crear los recursos necesarios;
- Conocimientos básicos de SQL;
- Conocimientos básicos de Python (útiles, pero no obligatorios);
- Familiaridad básica con los conceptos de ingeniería y procesamiento de datos.

---

## ▶️ Cómo ejecutar el workshop

### 1. Acceda al contenido

Abra este GitHub como página web: https://caiogusto2.github.io/workshop-dataplatform

### 2. Prepare el entorno

Primero, siga las instrucciones de preparación del laboratorio y cree los recursos de OCI necesarios.

### 3. Ejecute la Parte 1

Comience por el laboratorio de **OCI AI Data Platform**.

Construya las capas:

```text
Bronze → Silver → Gold
```

y replique los resultados en Autonomous Database.

### 4. Ejecute la Parte 2

Después de finalizar la primera parte, continúe con el laboratorio de **Oracle Autonomous Database 26ai**.

En esta etapa utilizará los conjuntos de datos creados anteriormente para explorar automatización, Select AI, APEX, seguridad y API.

---

## ⚠️ Importante

Este workshop crea recursos en Oracle Cloud que pueden consumir créditos o generar costos según el tipo de cuenta y la configuración.

Al finalizar el laboratorio, revise los recursos aprovisionados y elimine los que ya no necesite.

Nunca almacene en el repositorio:

- contraseñas;
- claves privadas;
- claves de API;
- wallets;
- tokens;
- OCID u otras credenciales sensibles que no deban ser públicas.

---

## 👥 Autores

**Autor**

- Caio Oliveira

**Autora colaboradora**

- Isabelle Anjos

---

## 🛡️ Safe Harbor

El contenido de este workshop tiene fines exclusivamente educativos e informativos.

Las funcionalidades, recursos, servicios, disponibilidad y demás características de los productos Oracle presentados en este material pueden cambiar en cualquier momento.

El contenido no representa un compromiso de entrega de ningún material, código o funcionalidad, y no debe usarse como base para decisiones de compra.

---

## 📚 Recursos

- [Documentación de Oracle Cloud Infrastructure](https://docs.oracle.com/en-us/iaas/)
- [Documentación de Oracle Autonomous Database](https://docs.oracle.com/en/cloud/paas/autonomous-database/)
- [Oracle APEX](https://apex.oracle.com/)
- [Oracle REST Data Services](https://www.oracle.com/database/technologies/appdev/rest.html)

---

## ⭐ Acerca de este proyecto

Este repositorio fue creado para apoyar workshops y demostraciones prácticas de una arquitectura moderna de datos con tecnologías Oracle.

Si este contenido le resultó útil, considere agregar una ⭐ al repositorio.
