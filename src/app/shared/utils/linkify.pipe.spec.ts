import { LinkifyPipe } from './linkify.pipe';

describe('LinkifyPipe', () => {
  const pipe = new LinkifyPipe();

  it('preserves missing values and plain text', () => {
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('A title\nAnother line')).toBe('A title\nAnother line');
  });

  it('preserves query parameters, line breaks and surrounding punctuation', () => {
    expect(pipe.transform('Read (https://example.org?q=a&sort=b).\nhttps://example.org/Title_(work)!'))
      .toBe('Read (<a href="https://example.org/?q=a&amp;sort=b" target="_blank" rel="noopener noreferrer">https://example.org?q=a&amp;sort=b</a>).\n'
        + '<a href="https://example.org/Title_(work)" target="_blank" rel="noopener noreferrer">https://example.org/Title_(work)</a>!');
  });

  it('escapes markup and leaves non-HTTP protocols as plain text', () => {
    expect(pipe.transform('<img src=x onerror="bad"> javascript:bad https://example.org/path')).toBe(
      '&lt;img src=x onerror=&quot;bad&quot;&gt; javascript:bad <a href="https://example.org/path" target="_blank" rel="noopener noreferrer">https://example.org/path</a>',
    );
  });

  it('leaves invalid candidates as plain text and renders later URLs', () => {
    expect(pipe.transform('https://:90 then http://a')).toBe('https://:90 then <a href="http://a/" target="_blank" rel="noopener noreferrer">http://a</a>');
  });
});
