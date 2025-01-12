-- CreateTable
CREATE TABLE `Lesson` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `subject` VARCHAR(191) NULL,
    `difficulty` ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') NOT NULL,
    `estimatedTime` INTEGER NOT NULL,
    `totalItems` INTEGER NOT NULL,
    `version` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `lessonItemId` VARCHAR(191) NULL,

    UNIQUE INDEX `Category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LessonItem` (
    `id` VARCHAR(191) NOT NULL,
    `recallCategory` ENUM('UNSEEN', 'SKIPPED', 'MASTERED', 'PRACTICE') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `intervalModifier` DOUBLE NOT NULL,
    `lessonId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CardSide` (
    `id` VARCHAR(191) NOT NULL,
    `markdown` TEXT NOT NULL,
    `pronunciation` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `language` VARCHAR(191) NULL,
    `level` VARCHAR(191) NULL,
    `audio` VARCHAR(191) NULL,
    `video` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `lessonItemId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PracticeEvent` (
    `id` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `result` ENUM('UNSEEN', 'SKIPPED', 'MASTERED', 'PRACTICE') NOT NULL,
    `timeSpent` INTEGER NOT NULL,
    `recalledSide` INTEGER NOT NULL,
    `confidenceLevel` INTEGER NOT NULL,
    `isCorrect` BOOLEAN NOT NULL,
    `attemptCount` INTEGER NOT NULL,
    `sourceCategory` ENUM('PRACTICE', 'MASTERED', 'UNSEEN') NOT NULL,
    `lessonItemId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Tag_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CategoryToLesson` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CategoryToLesson_AB_unique`(`A`, `B`),
    INDEX `_CategoryToLesson_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_LessonItemToTag` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_LessonItemToTag_AB_unique`(`A`, `B`),
    INDEX `_LessonItemToTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_lessonItemId_fkey` FOREIGN KEY (`lessonItemId`) REFERENCES `LessonItem`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonItem` ADD CONSTRAINT `LessonItem_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CardSide` ADD CONSTRAINT `CardSide_lessonItemId_fkey` FOREIGN KEY (`lessonItemId`) REFERENCES `LessonItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PracticeEvent` ADD CONSTRAINT `PracticeEvent_lessonItemId_fkey` FOREIGN KEY (`lessonItemId`) REFERENCES `LessonItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToLesson` ADD CONSTRAINT `_CategoryToLesson_A_fkey` FOREIGN KEY (`A`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToLesson` ADD CONSTRAINT `_CategoryToLesson_B_fkey` FOREIGN KEY (`B`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LessonItemToTag` ADD CONSTRAINT `_LessonItemToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `LessonItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LessonItemToTag` ADD CONSTRAINT `_LessonItemToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
