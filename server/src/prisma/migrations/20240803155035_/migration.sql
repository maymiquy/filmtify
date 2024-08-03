-- CreateEnum
CREATE TYPE "MovieStatus" AS ENUM ('POPULAR', 'RECOMENDED', 'NOW_PLAYING', 'TOP_RATED');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'UNACTIVE');

-- CreateEnum
CREATE TYPE "MembershipType" AS ENUM ('Basic', 'Premium', 'Platinum');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "cust_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" TEXT NOT NULL,
    "type" "MembershipType" NOT NULL,
    "access_daily_limit" INTEGER NOT NULL,
    "reset_daily_limit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expire_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genres" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "poster_url" TEXT NOT NULL,
    "video_url" TEXT NOT NULL,
    "rate" DOUBLE PRECISION,
    "year" TEXT NOT NULL,
    "movie_status" "MovieStatus" NOT NULL DEFAULT 'RECOMENDED',
    "upload_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GenreToMovie" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_cust_id_key" ON "users"("cust_id");

-- CreateIndex
CREATE INDEX "users_id_username_email_status_cust_id_idx" ON "users"("id", "username", "email", "status", "cust_id");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_id_key" ON "memberships"("id");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_user_id_key" ON "memberships"("user_id");

-- CreateIndex
CREATE INDEX "memberships_id_type_user_id_idx" ON "memberships"("id", "type", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "genres_id_key" ON "genres"("id");

-- CreateIndex
CREATE UNIQUE INDEX "genres_name_key" ON "genres"("name");

-- CreateIndex
CREATE INDEX "genres_id_name_idx" ON "genres"("id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "movies_id_key" ON "movies"("id");

-- CreateIndex
CREATE INDEX "movies_id_title_rate_year_movie_status_idx" ON "movies"("id", "title", "rate", "year", "movie_status");

-- CreateIndex
CREATE UNIQUE INDEX "_GenreToMovie_AB_unique" ON "_GenreToMovie"("A", "B");

-- CreateIndex
CREATE INDEX "_GenreToMovie_B_index" ON "_GenreToMovie"("B");

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToMovie" ADD CONSTRAINT "_GenreToMovie_A_fkey" FOREIGN KEY ("A") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToMovie" ADD CONSTRAINT "_GenreToMovie_B_fkey" FOREIGN KEY ("B") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
