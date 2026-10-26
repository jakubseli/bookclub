package com.example.bookclub.common;

import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ImageTypeTest {

    @Test
    void recognisesJpegPngAndWebp() {
        assertEquals(Optional.of(ImageType.JPEG), ImageType.detect(new byte[]{(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, 0x00}));
        assertEquals(Optional.of(ImageType.PNG), ImageType.detect(new byte[]{(byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A, 0x00}));
        assertEquals(Optional.of(ImageType.WEBP), ImageType.detect(new byte[]{'R', 'I', 'F', 'F', 0, 0, 0, 0, 'W', 'E', 'B', 'P'}));
    }

    @Test
    void rejectsOtherFilesEvenWithAnImageName() {
        assertEquals(Optional.empty(), ImageType.detect("GIF89a".getBytes()));
        assertEquals(Optional.empty(), ImageType.detect("<svg></svg>".getBytes()));
        assertEquals(Optional.empty(), ImageType.detect(new byte[]{'R', 'I', 'F', 'F', 0, 0, 0, 0, 'W', 'A', 'V', 'E'}));
        assertEquals(Optional.empty(), ImageType.detect(new byte[0]));
    }
}
