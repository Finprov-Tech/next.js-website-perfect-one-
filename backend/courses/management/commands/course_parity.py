from pathlib import Path

from django.core.management.base import BaseCommand

from courses.management.commands.import_courses import load_source, source_hash
from courses.models import Course


class Command(BaseCommand):
    help = 'Read-only parity report comparing the TypeScript manifest with the canonical CMS import.'

    def add_arguments(self, parser):
        default = Path(__file__).resolve().parents[4] / 'next.js-website-perfect-one-' / 'src' / 'data' / 'courses.ts'
        parser.add_argument('--source', type=Path, default=default)

    def handle(self, *args, **options):
        payloads = load_source(options['source'].resolve())
        expected = {row['slug']: row for row in payloads}
        actual = {row.slug: row for row in Course.objects.prefetch_related(
            'aliases', 'highlights', 'tools', 'hiring_partners', 'curriculum_modules__topics',
            'skills', 'audiences', 'job_opportunities', 'faqs', 'certifications', 'career_prospects',
        )}
        missing = sorted(set(expected) - set(actual)); extra = sorted(set(actual) - set(expected))
        hash_mismatch = sorted(slug for slug in set(expected) & set(actual) if actual[slug].source_hash != source_hash(expected[slug]))
        media_missing = sorted(slug for slug, course in actual.items() if not course.image or not course.image.storage.exists(course.image.name))
        nested_mismatch = []
        relations = [('aliases', 'aliases'), ('highlights', 'highlights'), ('tools', 'tools'), ('hiringPartners', 'hiring_partners'),
                     ('topSkills', 'skills'), ('whoIsThisFor', 'audiences'), ('jobOpportunities', 'job_opportunities'),
                     ('faqs', 'faqs'), ('certifications', 'certifications'), ('careerProspects', 'career_prospects')]
        for slug in set(expected) & set(actual):
            for source_key, related in relations:
                if len(expected[slug].get(source_key) or []) != getattr(actual[slug], related).count():
                    nested_mismatch.append(f'{slug}:{source_key}')
            modules = expected[slug].get('curriculum') or []
            if len(modules) != actual[slug].curriculum_modules.count() or sum(len(x.get('topics') or []) for x in modules) != sum(x.topics.count() for x in actual[slug].curriculum_modules.all()):
                nested_mismatch.append(f'{slug}:curriculum')
        self.stdout.write(f'source={len(expected)} cms={len(actual)} missing={len(missing)} extra={len(extra)} hash_mismatch={len(hash_mismatch)} nested_mismatch={len(nested_mismatch)} media_missing={len(media_missing)}')
        self.stdout.write(f'content_review={Course.objects.filter(needs_content_review=True).count()} url_review={Course.objects.filter(needs_url_review=True).count()} published={Course.objects.filter(status=Course.STATUS_PUBLISHED).count()}')
        for label, values in [('missing', missing), ('extra', extra), ('hash_mismatch', hash_mismatch), ('nested_mismatch', nested_mismatch), ('media_missing', media_missing)]:
            if values:
                self.stdout.write(f'{label}: {values}')
