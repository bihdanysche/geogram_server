import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { NewPostDTO } from "./dtos/NewPostDTO";
import { EditPostDTO } from "./dtos/EditPostDTO";
import { ErrorCode } from "src/exception-filter/errors.enum";
import { PaginationDTO } from "src/common/dtos/PaginationDTO";

@Injectable()
export class PostsService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createPost(dto: NewPostDTO, authorId: number) {
        return await this.prisma.post.create({
            data: {
                content: dto.content.trim(),
                authorId
            }
        })
    }

    async editPost(dto: EditPostDTO, postId: number, authorId: number) {
        try {
            await this.prisma.post.update({
                where: {
                    id: postId,
                    authorId
                },
                data: {
                    content: dto.content?.trim(),
                    editedAt: new Date()
                }
            });
        } catch {
            throw new NotFoundException({
                code: ErrorCode.INVALID_POST
            })
        }
    }

    async deletePost(postId: number, authorId: number) {
        try {
            await this.prisma.post.delete({
                where: {
                    id: postId,
                    authorId
                }
            });
        } catch {
            throw new NotFoundException({
                code: ErrorCode.INVALID_POST
            })
        }
    }

    async getPost(postId: number) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            throw new NotFoundException({
                code: ErrorCode.INVALID_POST
            })
        }

        return post;
    }

    async filterPosts(dto: PaginationDTO, authorId?: number) {
        try {
            const users = await this.prisma.post.findMany({
                where: {
                    authorId: authorId ? authorId : undefined
                },
                orderBy: { createdAt: "desc" },
                take: dto.take+1,
                cursor: dto.cursor ? { id: dto.cursor } : undefined
            });

            let nextCursor: number | null = null;
            if (users.length > dto.take) {
                nextCursor = users.pop()!.id;
            }

            return {
                results: users,
                nextCursor
            }
        } catch {
            return {
                results: [],
                nextCursor: null
            }
        }
    }
}