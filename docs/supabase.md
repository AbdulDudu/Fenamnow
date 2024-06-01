---
marp: true
---

# Supabase

This is simply the entire backend backend infastructure for Fenamnow. This includes the database. The realtime communication and API endpoints

## Database

The Database is a Postgres database run in a serverless architecture and serves well for most the needs of this app

## Database structure

The Structure pf the database can be found in the packages/types/src/database.ts file. It contains the schema for each table and the types for each column
