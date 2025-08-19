import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideosService } from '../videos.service';
import { Video } from '../entities/video.entity';
import { CreateVideoDto } from '../dto/create-video.dto';
import { NotFoundException } from '@nestjs/common';

describe('VideosService', () => {
  let service: VideosService;
  let repository: Repository<Video>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideosService,
        {
          provide: getRepositoryToken(Video),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<VideosService>(VideosService);
    repository = module.get<Repository<Video>>(getRepositoryToken(Video));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a videos', async () => {
      const createVideoDto: CreateVideoDto = {
        title: 'Test Video',
        description: 'Test Description',
        youtubeId: 'abc123',
      };

      const savedVideo = { id: 1, ...createVideoDto };

      mockRepository.create.mockReturnValue(createVideoDto);
      mockRepository.save.mockResolvedValue(savedVideo);

      const result = await service.create(createVideoDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createVideoDto);
      expect(mockRepository.save).toHaveBeenCalledWith(createVideoDto);
      expect(result).toEqual(savedVideo);
    });
  });

  describe('findByYoutubeId', () => {
    it('should return videos by YouTube ID', async () => {
      const video = { id: 1, title: 'Test Video', youtubeId: 'abc123' };

      mockRepository.findOne.mockResolvedValue(video);

      const result = await service.findByYoutubeId('abc123');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { youtubeId: 'abc123' },
      });
      expect(result).toEqual(video);
    });

    it('should throw NotFoundException if videos not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findByYoutubeId('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByUploader', () => {
    it('should return videos by uploader', async () => {
      const videos = [
        { id: 1, title: 'Video 1', uploader: 'test-user' },
        { id: 2, title: 'Video 2', uploader: 'test-user' },
      ];

      mockRepository.find.mockResolvedValue(videos);

      const result = await service.findByUploader('test-user');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { uploader: 'test-user' },
      });
      expect(result).toEqual(videos);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if videos not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
});
