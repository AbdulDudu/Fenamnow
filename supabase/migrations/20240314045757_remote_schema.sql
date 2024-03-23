set check_function_bodies = off;

CREATE OR REPLACE FUNCTION storage.extension(name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
_filename text;
BEGIN
    select string_to_array(name, '/') into _parts;
    select _parts[array_length(_parts,1)] into _filename;
    -- @todo return the last part instead of 2
    return split_part(_filename, '.', 2);
END
$function$
;

CREATE OR REPLACE FUNCTION storage.filename(name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
BEGIN
    select string_to_array(name, '/') into _parts;
    return _parts[array_length(_parts,1)];
END
$function$
;

CREATE OR REPLACE FUNCTION storage.foldername(name text)
 RETURNS text[]
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
BEGIN
    select string_to_array(name, '/') into _parts;
    return _parts[1:array_length(_parts,1)-1];
END
$function$
;

create policy "All authenticated users can do whatever they want 1tf88_0"
on "storage"."objects"
as permissive
for select
to authenticated
using ((bucket_id = 'chat'::text));


create policy "All authenticated users can do whatever they want 1tf88_1"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'chat'::text));


create policy "All authenticated users can do whatever they want 1tf88_2"
on "storage"."objects"
as permissive
for update
to authenticated
using ((bucket_id = 'chat'::text));


create policy "All authenticated users can do whatever they want 1tf88_3"
on "storage"."objects"
as permissive
for delete
to authenticated
using ((bucket_id = 'chat'::text));


create policy "Anyone can upload an avatar."
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'avatars'::text));


create policy "Avatar images are publicly accessible."
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'avatars'::text));


create policy "Open Season 1gqsgw9_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'application_documents'::text));


create policy "Open Season 1gqsgw9_1"
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'application_documents'::text));


create policy "Open Season 1gqsgw9_2"
on "storage"."objects"
as permissive
for update
to public
using ((bucket_id = 'application_documents'::text));


create policy "Open Season for all 1jpriur_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'properties'::text));


create policy "Open Season for all 1jpriur_1"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'properties'::text));


create policy "Open Season for all 1jpriur_2"
on "storage"."objects"
as permissive
for update
to public
using ((bucket_id = 'properties'::text));


create policy "Publicly accessible to everyone 1eh1tb7_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'global'::text));


create policy "open season 1oj01fe_0"
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'avatars'::text));


create policy "open season 1oj01fe_1"
on "storage"."objects"
as permissive
for update
to public
using ((bucket_id = 'avatars'::text));


create policy "open season 1oj01fe_2"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'avatars'::text));



