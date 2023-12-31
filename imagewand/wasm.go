package imagewand

import (
	"errors"
	"image/gif"
	"image/jpeg"
	"image/png"
	"os"
	"strings"

	"io"

	"image"
)

// ImageWand Instance of where the magic happens
type ImageWand struct {
	img image.Image
}

// FileFormat supported file formats
type FileFormat string

const (
	// supported file formats
	FileFormatJPG FileFormat = "jpeg"
	FileFormatPNG FileFormat = "png"
	FileFormatGIF FileFormat = "gif"
)

// Open creates an instance of ImageWand based on a file in the file system
func Open(src string) (ImageWand, error) {
	f, err := os.Open(src)
	if err != nil {
		return ImageWand{}, err
	}

	return New(f)
}

// New returns an instance of ImageWand
func New(r io.Reader) (ImageWand, error) {
	img, _, err := image.Decode(r)
	if err != nil {
		return ImageWand{}, err
	}

	return ImageWand{img: img}, nil
}

// Convert converts image into specified format
func (i ImageWand) Convert(w io.Writer, format FileFormat) error {
	switch format {
	case FileFormatJPG:
		return jpeg.Encode(w, i.img, &jpeg.Options{
			Quality: 100,
		})
	case FileFormatGIF:
		return gif.Encode(w, i.img, nil)
	case FileFormatPNG:
		return png.Encode(w, i.img)

	default:
		return errors.New("unsupported format")
	}
}

// Save for the lazy ones, it save to a specific destination on the file system
func (i ImageWand) Save(dest string) error {
	f, err := os.Create(dest)
	if err != nil {
		return err
	}

	var format FileFormat
	switch {
	case extensionIsAny(dest, []string{"jpeg", "jpg"}):
		format = FileFormatJPG
	case extensionIsAny(dest, []string{"png"}):
		format = FileFormatPNG
	case extensionIsAny(dest, []string{"gif"}):
		format = FileFormatGIF
	default:
		return errors.New("unsupported format")
	}

	return i.Convert(f, format)
}

func extensionIsAny(input string, compare []string) bool {
	for _, v := range compare {
		if strings.HasSuffix(input, v) {
			return true
		}
	}

	return false
}
