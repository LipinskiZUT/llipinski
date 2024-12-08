<?php

/** @var \App\Service\Router $router */

$title = 'Show Article';
$bodyClass = 'index';

ob_start(); ?>
<h1>Szczegóły artykułu</h1>

<p><strong>ID:</strong> <?= htmlspecialchars($article->getId()) ?></p>
<p><strong>Tytuł:</strong> <?= htmlspecialchars($article->getTitle()) ?></p>
<p><strong>Treść:</strong> <?= nl2br(htmlspecialchars($article->getBody())) ?></p>
<p><strong>Autor:</strong> <?= htmlspecialchars($article->getAuthor()) ?></p>
<p><strong>Opublikowano:</strong> <?= htmlspecialchars($article->getPublishedAt() ?? 'Nieopublikowano') ?></p>

<a href="?action=article-edit&id=<?= $article->getId() ?>">Edytuj</a>
<a href="?action=article-delete&id=<?= $article->getId() ?>" onclick="return confirm('Na pewno usunąć?');">Usuń</a>
<a href="?action=article-index">Powrót do listy</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';