<?php
namespace App\Model;

use App\Service\Config;

class Article
{
    private ?int $id = null;
    private ?string $title = null;
    private ?string $body = null;
    private ?string $author = null;
    private ?string $published_at = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Article
    {
        $this->id = $id;
        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): Article
    {
        $this->title = $title;
        return $this;
    }

    public function getBody(): ?string
    {
        return $this->body;
    }

    public function setBody(?string $body): Article
    {
        $this->body = $body;
        return $this;
    }

    public function getAuthor(): ?string
    {
        return $this->author;
    }

    public function setAuthor(?string $author): Article
    {
        $this->author = $author;
        return $this;
    }

    public function getPublishedAt(): ?string
    {
        return $this->published_at;
    }

    public function setPublishedAt(?string $published_at): Article
    {
        $this->published_at = $published_at;
        return $this;
    }

    public static function fromArray($array): Article
    {
        $article = new self();
        $article->fill($array);
        return $article;
    }

    public function fill($array): Article
    {
        if (isset($array['id']) && !$this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['title'])) {
            $this->setTitle($array['title']);
        }
        if (isset($array['body'])) {
            $this->setBody($array['body']);
        }
        if (isset($array['author'])) {
            $this->setAuthor($array['author']);
        }
        if (isset($array['published_at'])) {
            $this->setPublishedAt($array['published_at']);
        }
        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM article';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $articles = [];
        $articlesArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($articlesArray as $articleArray) {
            $articles[] = self::fromArray($articleArray);
        }
        return $articles;
    }

    public static function find($id): ?Article
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM article WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $articleArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (!$articleArray) {
            return null;
        }
        $article = Article::fromArray($articleArray);
        return $article;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (!$this->getId()) {
            $sql = "INSERT INTO article (title, body, author, published_at) VALUES (:title, :body, :author, :published_at)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'title' => $this->getTitle(),
                'body' => $this->getBody(),
                'author' => $this->getAuthor(),
                'published_at' => $this->getPublishedAt(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE article SET title = :title, body = :body, author = :author, published_at = :published_at WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':title' => $this->getTitle(),
                ':body' => $this->getBody(),
                ':author' => $this->getAuthor(),
                ':published_at' => $this->getPublishedAt(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM article WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setTitle(null);
        $this->setBody(null);
        $this->setAuthor(null);
        $this->setPublishedAt(null);
    }
}
