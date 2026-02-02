-- CreateEnum
CREATE TYPE "PostRatingType" AS ENUM ('Like', 'Dislike');

-- CreateTable
CREATE TABLE "PostRating" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "PostRatingType" NOT NULL,

    CONSTRAINT "PostRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostRating_postId_type_idx" ON "PostRating"("postId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "PostRating_postId_userId_key" ON "PostRating"("postId", "userId");

-- AddForeignKey
ALTER TABLE "PostRating" ADD CONSTRAINT "PostRating_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostRating" ADD CONSTRAINT "PostRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
