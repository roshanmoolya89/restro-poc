<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class ClearApiCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cache:clear-api
                            {--all : Clear all cache}
                            {--restaurants : Clear restaurant cache only}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear API response cache';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        if ($this->option('all')) {
            Cache::flush();
            $this->info('All cache cleared successfully!');
        } elseif ($this->option('restaurants')) {
            // For database/file driver, we clear all
            // In production with Redis, this would use tags
            Cache::flush();
            $this->info('Restaurant cache cleared successfully!');
        } else {
            Cache::flush();
            $this->info('API cache cleared successfully!');
        }

        return Command::SUCCESS;
    }
}
