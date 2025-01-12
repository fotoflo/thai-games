/*
  Warnings:

  - You are about to drop the column `lessonItemId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the `CardSide` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LessonItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PracticeEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LessonItemToTag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `items` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `CardSide` DROP FOREIGN KEY `CardSide_lessonItemId_fkey`;

-- DropForeignKey
ALTER TABLE `Category` DROP FOREIGN KEY `Category_lessonItemId_fkey`;

-- DropForeignKey
ALTER TABLE `LessonItem` DROP FOREIGN KEY `LessonItem_lessonId_fkey`;

-- DropForeignKey
ALTER TABLE `PracticeEvent` DROP FOREIGN KEY `PracticeEvent_lessonItemId_fkey`;

-- DropForeignKey
ALTER TABLE `_LessonItemToTag` DROP FOREIGN KEY `_LessonItemToTag_A_fkey`;

-- DropForeignKey
ALTER TABLE `_LessonItemToTag` DROP FOREIGN KEY `_LessonItemToTag_B_fkey`;

-- DropIndex
DROP INDEX `Category_lessonItemId_fkey` ON `Category`;

-- AlterTable
ALTER TABLE `Category` DROP COLUMN `lessonItemId`;

-- AlterTable
ALTER TABLE `Lesson` ADD COLUMN `items` JSON NOT NULL;

-- DropTable
DROP TABLE `CardSide`;

-- DropTable
DROP TABLE `LessonItem`;

-- DropTable
DROP TABLE `PracticeEvent`;

-- DropTable
DROP TABLE `Tag`;

-- DropTable
DROP TABLE `_LessonItemToTag`;
