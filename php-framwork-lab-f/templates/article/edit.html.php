<?php

/** @var \App\Service\Router $router */

$title = 'Edit Article';
$bodyClass = 'index';

ob_start(); ?>
<h1>Edytuj artykuł</h1>

<form action="?action=article-edit&id=<?= $article->getId() ?>" method="post">
    <label for="title">Tytuł:</label>
    <input type="text" id="title" name="article[title]" value="<?= htmlspecialchars($article->getTitle()) ?>" required>

    <label for="body">Treść:</label>
    <textarea id="body" name="article[body]" rows="10" required><?= htmlspecialchars($article->getBody()) ?></textarea>

    <label for="author">Autor:</label>
    <input type="text" id="author" name="article[author]" value="<?= htmlspecialchars($article->getAuthor()) ?>" required>

    <label for="published_at">Data publikacji:</label>
    <input type="datetime-local" id="published_at" name="article[published_at]" value="<?= htmlspecialchars($article->getPublishedAt()) ?>">

    <button type="submit">Zapisz zmiany</button>
</form>
<a href="?action=article-index">Powrót do listy</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';