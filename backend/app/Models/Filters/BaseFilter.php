<?php

namespace App\Models\Filters;


use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;
use Illuminate\Pagination\LengthAwarePaginator;

trait BaseFilter
{
    public function scopePerPage(Builder $builder): LengthAwarePaginator
    {
        return self::isExist(__METHOD__)
            ? $builder->paginate(request(self::paramName(__METHOD__)))
            : $builder->paginate(10);
    }

    public function scopeSortBy(Builder $builder): Builder
    {
//        $sort_by = request('sort_by');
//        if ($this->fillable && !in_array($sort_by, $this->fillable)) {
//            return $builder;
//        }
        return self::paramExists('sort_by')
            ? $builder->orderBy(request('sort_by'), request('sort_order', 'asc'))
            : $builder;
    }

    public function scopeSearch(Builder $builder): Builder
    {
        $columns = $this->getTableColumns();
        return self::paramExists('search')
            ? $builder->where(function ($query) use ($columns) {
                foreach ($columns as $column) {
                    $query->orWhere($column, 'LIKE', '%' . request('search') . '%');
                }
            }) : $builder;
    }

    protected static function paramName($methodName): string
    {
        $with_scope = explode('::', $methodName)[1];
        $without_scope = str_replace('scope', '', $with_scope);
        return Str::snake($without_scope);
    }

    protected static function paramExists($param): bool
    {
        if (request()->get($param) !== null) {
            return true;
        }
        return false;
    }

    // to check if query parameter exists
    protected static function isExist($param): bool
    {
        if (!empty(request()->get(self::paramName($param)))) {
            return true;
        }
        return false;
    }
}
