# Phase 1 Pair Project Themes
## Overview
Setiap Team Pair Project akan mendapatkan tema challenqe yang ditentukan oleh instruktur.
Silakan tanyakan kepada buddy instruktur bila kamu belum mendapat tema challenge.

## Requirement Level Database
1. Schema Table (ERD)
2. Terdapat entitas/table **wajlb** yaitu Users dengan atibute yang harus ada:
    a. email
    b. paSSword
    c. role
3. Memliki 3 jenis asosiasi yandg Derbeda:
    a. One to One
    b. One to Many
    c. Many to Many (belongsToMany)
4. Membuat model & migration
5. Membuat migration tambahan (add column, rename column, remove column, add constraint, dsb)
6. Membuat seeder (minimal 1)

## Requirement Routes
1. Minimal terdapat 2 route GET dan 1 route POST
2. Terdapat route untuk logout

## Requirerment Aplikasi
1. Terdapat fitur search atau sort (menggunakan OP dari sequelize)
2. Terdapat **static method** di model (untuk ambil data)
3. Terdapat **instance method atau getter** di model
4. Menggunakan berbagai macam validasl dari seduelize dan mengolahnya
sehingga tampil pada page (lebih dari 1 jenis validasi, notEmpty dan notNull
dihitung 1 validasi)
5. Menggunakan method-method sequelize yand bertujuan untuk CRUD
6. Terdapat **hooks**
7. Membuat dan menggunakan **helper**
8. Menggunakan mekanisme promise chaining (notifikasi delete kaya challenge 6)

## Requirement Pages
1. Landing page (menggambarkan project)
2. Register & login page
3. Memiliki 1 page yang menampilkan data gabungan dari 2 table atau lebih
(gunakan **eager loading** dari sequelize)

## Requirement Explore
1. Membuat sistem login dengan middleware, session & [bcryptis](https://www.npmjs.com/package/bcryptjs)
2. Membuat fitur MVP(Minimal Valuable Package) (fitur unik dengan menggunakan
package yang belum pernah dibahas saat lecture)

## Tema Pair project
Berikut adalah list entitas/tabel sesuai dengan tema terkait. Kamu boleh menambahkan table maupun field lainnya bila memang dibutuhkan. Setiap tema harus mengandung **minimal masing-masing 1 asosiasi (1 to 1, 1 to M, and M to M). Entitas/Table User pasti dimiliki cleh setiap tema. List field user**:
User
e id
@ username:string (optional)
@ = email:string (validation: required, unique, email format)
® password:string (validation: required, length min 8)
= role:string (validation: in [‘buyer’, ‘seller’])
Berikut list tema beserta entitas (table) yang terkait dan hanyalah sebagai panduan tidak
harus sama persis.
1. Social Media(Contch:facebcck.com, twitter.com, instagram.com)
a. Posts (entitas utama)
e id
e title : string (validation: required)
e@ content : text (validation: required)
@ = imgUrl: string (validation: isUrl)
© createdAt : date
@ updatedAt : date
e tagid
© userid